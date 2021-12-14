import json
import boto3


def lambda_handler(event, context):

    def handleGetActivities(id):
        dynamodb = boto3.resource('dynamodb')
        activitiesTable = dynamodb.Table('fbla_activities_table')
        response = activitiesTable.get_item(
            Key={
                'id': id
            }
        )
        return response
    
    bodyDict = json.loads(event['body'])
    id = bodyDict['id']
    action = bodyDict['action']

    if action == 'getActivities':
        response = handleGetActivities(id)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        message = response['Item']['activities'] if statusCode == 200 else f'Failed to get activities for id {id}'
        print(message)
        return {
            "statusCode": statusCode,
            "body": json.dumps(message)
        }
    
    return {
        "statusCode": 400,
        "body": json.dumps({
            "message": f"Invalid activities action requested for id {id}",
        }),
    }
