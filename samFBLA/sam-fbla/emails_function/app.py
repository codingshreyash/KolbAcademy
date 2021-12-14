import json

# import requests
import boto3
import uuid
from datetime import datetime


def lambda_handler(event, context):

    def handleInsertClientEmails(clientId, emailLst):
        dynamodb = boto3.resource('dynamodb')
        emailsTable = dynamodb.Table('fbla_emails_table')
        response = emailsTable.put_item(
        Item={
                'clientId': clientId,
                'emailLst': emailLst,
            }
        )
        return response
    
    def handleGetClientEmails(clientId):
        dynamodb = boto3.resource('dynamodb')
        emailsTable = dynamodb.Table('fbla_emails_table')
        response = emailsTable.get_item(
            Key={
                'clientId': clientId
            }
        )
        print('handleGetClientEmails: returning' + str(response) + ' for clientId: ' + clientId)
        return response
    
    def addEmailToEmailThread(clientId, emailThreadsList, emailInfo):
        if 'threadId' in emailInfo and len(emailThreadsList) > 0:
            for emailThread in emailThreadsList:
                if emailInfo['threadId'] == emailThread['threadId']:
                    emailThread['msgLst'].append(emailInfo)
        else:
            emailThreadsList.append({
                'threadId': str(hash(emailInfo.values)),
                'userLst': [emailInfo['senderEmailAddress'], emailInfo['recipientEmailAddress']],
                'subject': emailInfo['subject'],
                'msgLst': [emailInfo]
            })
        handleInsertClientEmails(clientId, emailThreadsList)


    def handleSendEmail(clientId, emailInfo):
        dynamodb = boto3.resource('dynamodb')
        usersTable = dynamodb.Table('fbla_users_table')
        getRecipientClientIdResponse = usersTable.get_item(Key={'emailAddress': emailInfo['recipientEmailAddress']})
        recipientClientId = getRecipientClientIdResponse['Item']['clientId'] if getRecipientClientIdResponse['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in getRecipientClientIdResponse else None

        if recipientClientId is not None:
            getRecipientEmailsResponse = handleGetClientEmails(recipientClientId)
            recipientEmailThreads = getRecipientEmailsResponse['Item']['emailLst'] if getRecipientEmailsResponse['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in getRecipientEmailsResponse else None

            getSenderEmailsResponse = handleGetClientEmails(clientId)
            senderEmailThreads = getSenderEmailsResponse['Item']['emailLst'] if getSenderEmailsResponse['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in getSenderEmailsResponse else None

            if recipientEmailThreads is not None and senderEmailThreads is not None:
                emailInfo['emailID'] = str(uuid.uuid4())
                emailInfo['messageUnread'] = False
                emailInfo['timestamp'] = datetime.now().strftime("%d/%m/%y @ %I:%M %p")
                addEmailToEmailThread(clientId, senderEmailThreads, emailInfo)
                addEmailToEmailThread(recipientClientId, recipientEmailThreads, emailInfo)
                print('Email sent successfully')
                return {
                    'statusCode': 200,
                    "body": json.dumps({
                        "message": 'sent email successfully'
                    })
                }
            else:
                print('Error retrieving email threads for recipient or sender')
                return {
                    "statusCode": 400,
                    "body": json.dumps({
                        "message": 'Error retrieving email threads for recipient or sender'
                })
            }

        else:
            print('Could Not Find User with Email Address: ' + emailInfo['recipientEmailAddress'])
            return {
                "statusCode": 400,
                "body": json.dumps({
                    "message": 'Could Not Find User with Email Address: ' + emailInfo['recipientEmailAddress']
                })
            }


    bodyDict = json.loads(event['body'])
    clientId = bodyDict['clientId']
    action = bodyDict['action']
    
    if action == 'insertClientEmails':
        emailLst = bodyDict['emailLst']
        response = handleInsertClientEmails(clientId, emailLst)
        statusCode = response['ResponseMetadata']['HTTPStatusCode']
        message = 'Insert Successful' if statusCode == 200 else 'Insert Failed'
        return {
            "statusCode": statusCode,
            "body": json.dumps({
                "message": message,
            }),
        }
    
    elif action == 'getClientEmails':
        response = handleGetClientEmails(clientId)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        message = response['Item']['emailLst'] if statusCode == 200 else []
        print(message)
        return {
            "statusCode": 200,
            "body": json.dumps(message)
        }
    
    elif action == 'sendEmail':
        emailInfo = bodyDict['emailInfo']
        return handleSendEmail(clientId, emailInfo)
        
        




    
    return {
        "statusCode": 400,
        "body": json.dumps({
            "message": f"Invalid email action requested for client {clientId}",
        }),
    }
