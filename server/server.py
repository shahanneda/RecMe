from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt

import boto3
from boto3.dynamodb.conditions import Key, Attr

import uuid
import time
import os
from decimal import Decimal
from functools import wraps


app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config["DEBUG"] = True
CORS(app)

os.environ['AWS_DEFAULT_REGION'] = 'us-west-2'
dynamodb = boto3.resource('dynamodb')
usersTable = dynamodb.Table('rec_me_users')


@app.route('/')
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
        validSession = [session for session in dbUser["sessions"] if session["id"] == request.headers["sessionID"]]
        if not validSession:
            return jsonify({
                "status":"fail",
                "reason":"invalid_session"
            })

        return func(dbUser, *args, **kwargs)

    return check_token



@app.route('/api/protected_test/', methods=["get"])
@require_valid_session
def protected_test(dbUser):
    return jsonify({
        "status":"success",
        "note":"You are logged in!"
        })

@app.route('/api/create_user/', methods=['post'])
def create_user():
    """
    POST: Creates new user
    POST Body:
    username: a unique username
    password
    email

    Returns: status, and if sucesfull session id
    if status == fail, will provide "reason"
    Reasons for failuire:
    duplicate: user id already exists
    incomplete: a required filed is not given

    """
    user = request.get_json(force=True)
    
    if not all(param in user for param in ("username", "email", "password")):
        return jsonify({
            "status": "fail",
            "reason": "incomplete"
        })

    # check for duplcate username
    userInTable = usersTable.query(
        KeyConditionExpression=Key('userID').eq(user['username'])
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
            "userID":user['username'],
            'displayName': user['username'],
            "email": user['email'],
            "password": passHash,
            "sessions": [
                {
                    "id": str(sessionID),
                    "timeCreated": round(Decimal(time.time()), 3),
                }
            ]
        }
    )
    return jsonify({
        "status": "success",
        "sessionID":  sessionID,
    })

    
@app.route('/api/login/', methods=['post'])
def login():
    """
    POST for logging in,
    Request body:
    userID: the userID for logging in, (will be original username at time of accoutn creation)
    password

    will return status:success, and session id,
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

    if bcrypt.check_password_hash(dbUser['password'], user['password'].encode("utf-8")):
        sessionID = uuid.uuid1()
        oldSession = dbUser['sessions']
        oldSession.append(
                {
                    "id": str(sessionID),
                    "timeCreated": round(Decimal(time.time()), 3),
                }
        )

        usersTable.update_item(
            Key={
                'userID': user['userID'],
            },
            UpdateExpression='SET sessions = :val1',
            ExpressionAttributeValues={
                ':val1': oldSession
            }
        )
        return jsonify({
            "status": "success",
            "sessionID":  sessionID,
        })
    #incorrect password
    else: 
        return jsonify({
            "status": "fail",
            "reason": "invalid"
        })




