import json
import boto3


def lambda_handler(event, context):

    def handleInsertEvents(id, eventsLst):
        dynamodb = boto3.resource('dynamodb')
        eventsTable = dynamodb.Table('fbla_events_table')
        response = eventsTable.put_item(
        Item={
                'id': id,
                'events': eventsLst,
            }
        )
        return response

    def handleGetEvents(id):
        dynamodb = boto3.resource('dynamodb')
        eventsTable = dynamodb.Table('fbla_events_table')
        response = eventsTable.get_item(
            Key={
                'id': id
            }
        )
        return response
    
    bodyDict = json.loads(event['body'])
    id = bodyDict['id']
    action = bodyDict['action']

    if action == 'getEvents':
        response = handleGetEvents(id)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        message = response['Item']['events'] if statusCode == 200 else f'Failed to get events for id {id}'
        print(message)
        return {
            "statusCode": statusCode,
            "body": json.dumps(message)
        }
    
    elif action == 'insertEvents':
        eventsLst = bodyDict['eventsLst']
        response = handleInsertEvents(id, eventsLst)
        statusCode = response['ResponseMetadata']['HTTPStatusCode']
        message = 'Insert Successful' if statusCode == 200 else 'Insert Failed'
        return {
            "statusCode": statusCode,
            "body": json.dumps({
                "message": message,
            }),
        }
    
    return {
        "statusCode": 400,
        "body": json.dumps({
            "message": f"Invalid events action requested for id {id}",
        }),
    }
