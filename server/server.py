from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from flask_bcrypt import Bcrypt

import boto3
from boto3.dynamodb.conditions import Key, Attr

import uuid
import time
import os
from movie import Movie
from decimal import Decimal
from functools import wraps
from database_managment import *

PUBLICLY_ADDED_USER_MOVIES_LIST_NAME = "paml" # publically added movie list

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config["DEBUG"] = True
CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'


os.environ['AWS_DEFAULT_REGION'] = 'us-west-2'
dynamodb = boto3.resource('dynamodb')
usersTable = dynamodb.Table('rec_me_users')




@app.route('/')
@cross_origin()
def info_page():
    return '<h1> RecMe Internal API Updated</h1><p>Please contact Shahan Neda for more info </p><a href="https://shahan.ca"/>Shahan.ca</a>'

def require_valid_session(func):
    """
    middleware that checks if valid sessions for userId
    will call the next function with a dbUser object, so extra database requests are not needed
    """
    @wraps(func)
    def check_token(*args, **kwargs):
        reqParams = request.get_json(force=True)
        print(request.json)
        if "userID" not in reqParams:
            return jsonify({
                "status": "fail",
                "reason": "incomplete"
            })
        # get user from database
        usersInTable = usersTable.query(
            KeyConditionExpression=Key('userID').eq(reqParams['userID'])
        )
        # check if user doenst exist
        if usersInTable['Count'] == 0:
            return jsonify({
                "status": "fail",
                "reason": "not_found"
            })
        if "sessionID" not in request.headers:
            return jsonify({
                "status": "fail",
                "reason": "invalid_session",
                "note": "please include a sessionID header with your reqeust"
            })
        dbUser = usersInTable['Items'][0]

        #TODO: Invalidate old sessions

        # go through all of this users sessions and see if any of them matches 
        if request.headers["sessionID"] not in dbUser["sessions"]:
            return jsonify({
                "status":"fail",
                "reason":"invalid_session"
            })

        return func(dbUser, *args, **kwargs)

    return check_token





@app.route('/api/protected_test/', methods=["get"])
@cross_origin()
@require_valid_session
def protected_test(dbUser):
    return jsonify({
        "status":"success",
        "note":"You are logged in!"
        })

@app.route('/api/create-account/', methods=['post'])
@cross_origin()
def create_user():
    """
    POST: Creates new user
    POST Body:
    userID: a unique userID
    password
    email

    Returns: status, and if sucesfull session id
    if status == fail, will provide "reason"
    Reasons for failuire:
    duplicate: user id already exists
    incomplete: a required filed is not given

    """
    user = request.get_json(force=True)
    
    if not all(param in user for param in ("userID", "email", "password")):
        return jsonify({
            "status": "fail",
            "reason": "incomplete"
        })

    # check for duplcate userID
    userInTable = usersTable.query(
        KeyConditionExpression=Key('userID').eq(user['userID'])
    )
    if userInTable['Count'] != 0:
        return jsonify({
            "status": "fail",
            "reason": "duplicate"
        })

    passHash = bcrypt.generate_password_hash(user['password'].encode('utf-8')).decode("utf-8")


    sessionID = uuid.uuid1()
    usersTable.put_item(
    Item={
            "userID":user['userID'],
            'displayName': user['userID'],
            "email": user['email'],
            "password": passHash,
            "sessions": {
                str(sessionID) : {
                    "timeCreated": round(Decimal(time.time()), 3),
                }
            }
        }
    )

    return jsonify({
        "status": "success",
        "userID": user["userID"],
        "displayName": user["userID"],
        "email": user["email"],
        "sessionID":  sessionID,
    })

    
@app.route('/api/logout/', methods=['post'])
@cross_origin()
@require_valid_session
def logout(dbUser):
    """
    POST for logging out user,
    requires valid sessionID header, and userID in request body

    return "status":"success"

    """
    sessionID = request.headers["sessionID"]
    oldSessions = dbUser['sessions']
    del oldSessions[str(sessionID)]

    usersTable.update_item(
        Key={
            'userID': dbUser['userID'],
        },
        UpdateExpression='SET sessions = :val1',
        ExpressionAttributeValues={
            ':val1': oldSessions
        }
    )
    return jsonify({
        "status": "success",
    })




@app.route('/api/user/<userID>/add_movie/', methods=['post'])
@require_valid_session
def add_movie_to_user(dbUser, userID):
    """
    POST: for adding a new movie to a user list
    request body must have:
        userID: user id of user adding to ist
        editedUserID: user id of person who is being added to 
        dateAdded: date when movie is added to list in milliseconds
        order: display order



        movieID: imdb id of movie
        name: name of movie
        year: year of movie
        image: image url of movie
    """

    body = request.get_json(force=True)

    if not all(param in body for param in ("userID", "editedUserID", "movieID", "name", "year", "image", "dateAdded", "order")):
        return jsonify({
            "status": "fail",
            "reason": "incomplete"
        })

    movie = vars(Movie(body["movieID"], body["name"], body["year"], body["image"], body["userID"], body["dateAdded"], body["order"]))

    status = add_object_to_user_list(usersTable, PUBLICLY_ADDED_USER_MOVIES_LIST_NAME,body["editedUserID"], movie)
    return status

    

@app.route('/api/user/<userID>/get_movies', methods=['get'])
def get_movies_for_user(userID):
    status = get_list_on_user(usersTable, PUBLICLY_ADDED_USER_MOVIES_LIST_NAME, userID)
    return status


@app.route('/api/user/<userID>', methods=['get'])
def get_user(userID):
    response = usersTable.get_item(
        Key={
            'userID': userID,
        }
    )

    if "Item" not in response:
        return jsonify({
            "status": "fail",
            "reason": "unknown"
        })
        
    item = response["Item"]
    print(item)
    del item["password"]

    return item

@app.route('/api/login/', methods=['post'])
@cross_origin()
def login():
    """
    POST for logging in,
    Request body:
    userID: the userID for logging in, (will be original userID at time of accoutn creation)
    password

    will return status:success, and userID, email, displayName, and sessionID
    or status:fail, with reason "incomplete" or "invalid"
    """

    user = request.get_json(force=True)

    if not all(param in user for param in ("userID", "password")):
        return jsonify({
            "status": "fail",
            "reason": "incomplete"
        })

    # get user from database
    usersInTable = usersTable.query(
        KeyConditionExpression=Key('userID').eq(user['userID'])
    )
    # check if user doenst exist
    if usersInTable['Count'] == 0:
        return jsonify({
            "status": "fail",
            "reason": "unknown"
        })
    dbUser = usersInTable['Items'][0]

    if bcrypt.check_password_hash(dbUser['password'], str(user['password']).encode("utf-8")):
        sessionID = uuid.uuid1()
        oldSessions = dbUser['sessions']
        oldSessions[str(sessionID)] = {"timeCreated": round(Decimal(time.time()), 3)}

        usersTable.update_item(
            Key={
                'userID': user['userID'],
            },
            UpdateExpression='SET sessions = :val1',
            ExpressionAttributeValues={
                ':val1': oldSessions
            }
        )
        return jsonify({
            "status": "success",
            "userID": dbUser["userID"],
            "displayName": dbUser["displayName"],
            "email": dbUser["email"],
            "sessionID":  sessionID,
        })
    #incorrect password
    else: 
        return jsonify({
            "status": "fail",
            "reason": "invalid"
        })




