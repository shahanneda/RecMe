
def add_object_to_user_list(userTable, listName, userID, obj):
    """general purpose utility function that adds an object to a listName on user with userID.
    if a list with listName does not existon user, will create it

    :return: 
    Args:
        userTables (boto3 table): table
        listName (str): list name in database
        userID (str): user database id
        obj (object): object that must have id

    Returns:
        status object: will return an object with parameter "status" to "fail" intended to be returned to the user
    """
    
    response = usersTable.get_item(
        Key={
            'userID': userID,
        }
    )

    if "Item" not in response:
        return { 
            "status": "fail",
            "reason": "unknown"
        }

    user = response["Item"]

    if listName in user:
        user[listName] = {}

    user[listName][obj.id] = obj

    usersTable.update_item(
        Key={
            'userID': user['userID'],
        },
        UpdateExpression='SET ' + listName + " = :val1',
        ExpressionAttributeValues={
            ':val1': user[listName]
        }
    )

    return {"status": "success"}
    


