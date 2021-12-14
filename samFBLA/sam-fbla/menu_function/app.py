import json
import boto3


def lambda_handler(event, context):

    def handleGetMenu(week):
        dynamodb = boto3.resource('dynamodb')
        menuTable = dynamodb.Table('fbla_menu_table')
        response = menuTable.get_item(
            Key={
                'week': week
            }
        )
        return response
    
    bodyDict = json.loads(event['body'])
    week = bodyDict['week']
    action = bodyDict['action']

    if action == 'getMenu':
        response = handleGetMenu(week)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        message = response['Item']['menu'] if statusCode == 200 else f'Failed to get menu for week {week}'
        print(message)
        return {
            "statusCode": statusCode,
            "body": json.dumps(message)
        }
    
    return {
        "statusCode": 400,
        "body": json.dumps({
            "message": f"Invalid menu action requested for week {week}",
        }),
    }
