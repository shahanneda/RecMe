from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_bcrypt import Bcrypt

import boto3
from boto3.dynamodb.conditions import Key, Attr

import uuid
import time
import os
from decimal import Decimal

app = Flask(__name__)
bcrypt = Bcrypt(app)

app.config["DEBUG"] = True
CORS(app)

os.environ['AWS_DEFAULT_REGION'] = 'us-west-2'
dynamodb = boto3.resource('dynamodb')
usersTable = dynamodb.Table('rec_me_users')


@app.route('/')
def hello_world():
    return '<h1> RecMe Internal API Updated</h1><p>Please contact Shahan Neda for more info </p><a href="https://shahan.ca"/>Shahan.ca</a>'

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
    sessionID = uuid.uuid1()
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

    passHash = bcrypt.generate_password_hash(user['password'])


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

    


