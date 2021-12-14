import json
import boto3


def lambda_handler(event, context):

    def handleGetUser(emailAddress):
        dynamodb = boto3.resource('dynamodb')
        usersTable = dynamodb.Table('fbla_users_table')
        response = usersTable.get_item(
            Key={
                'emailAddress': emailAddress
            }
        )
        return response
    
    bodyDict = json.loads(event['body'])
    emailAddress = bodyDict['emailAddress']
    action = bodyDict['action']

    if action == 'getUser':
        response = handleGetUser(emailAddress)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        
        if statusCode == 200:
            message = {
                'emailAddress': response['Item']['emailAddress'],
                'clientId': response['Item']['clientId'],
                'firstName': response['Item']['firstName'],
                'lastName': response['Item']['lastName'],
                'profilePicture': response['Item']['profilePicture'],
                'title': response['Item']['title'],
            }
        else:
            message = f'Failed to get user for emailAddress {emailAddress}'

        print(message)
        return {
            "statusCode": statusCode,
            "body": json.dumps(message)
        }
    
    return {
        "statusCode": 400,
        "body": json.dumps({
            "message": f"Invalid user action requested for clientId {emailAddress}",
        }),
    }
