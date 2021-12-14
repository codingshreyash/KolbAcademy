import json

# import requests
import boto3


def lambda_handler(event, context):

    def handleInsertClientCourses(clientId, courseLst):
        dynamodb = boto3.resource('dynamodb')
        coursesTable = dynamodb.Table('fbla_courses_table')
        response = coursesTable.put_item(
        Item={
                'clientId': clientId,
                'courseLst': courseLst,
            }
        )
        return response
    
    def handleGetClientCourses(clientId):
        dynamodb = boto3.resource('dynamodb')
        coursesTable = dynamodb.Table('fbla_courses_table')
        response = coursesTable.get_item(
            Key={
                'clientId': clientId
            }
        )
        return response
    

    def handleGetClientSchedule(clientId):
        periodTimes = {
            1: ("7:40 AM", "8:29 AM"),
            2: ("8:33 AM", "9:18 AM"),
            3: ("9:22 AM", "10:07 AM"),
            4: ("10:11 AM", "10:56 AM"),
            5: ("11:00 AM", "11:42 AM"),
            6: ("11:46 AM", "12:34 PM"),
            7: ("12:38 PM", "1:28 PM"),
            8: ("1:28 PM", "2:12 PM"),
        }

        dayMap = {
            "M": 0,
            "T": 1,
            "W": 2,
            "Th": 3,
            "F": 4,
        }

        schedule = [[{
            "name": "Free Period",
            "startTime": periodTimes[period][0],
            "endTime": periodTimes[period][1],
            "period": str(period),
            "teacherName": "-",
            "location": "-"
        } for period in range(1,9)] for _ in range(5)]

        response = handleGetClientCourses(clientId)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400

        courseLst = response['Item']['courseLst'] if statusCode == 200 else []
        for course in courseLst:
            for day in ['M', 'T', 'W', 'Th', 'F']:
                if course['days'][day]:
                    startTime, endTime = periodTimes[int(course['period'])]
                    course['startTime'] = startTime
                    course['endTime'] = endTime
                    schedule[dayMap[day]][int(course['period']) - 1] = {
                        "name": course['name'],
                        "location": course['location'],
                        "period": course['period'],
                        "teacherName": course['teacherName'],
                        "icon": course['icon'],
                        "startTime": startTime,
                        "endTime": endTime
                    }
        print(schedule)
        return {
            'statusCode': 200,
            'body': json.dumps(schedule)
        }


    bodyDict = json.loads(event['body'])
    clientId = bodyDict['clientId']
    action = bodyDict['action']

    if action == 'updateClientCourses':
        courseLst = bodyDict['courseLst']
    
    elif action == 'insertClientCourses':
        courseLst = bodyDict['courseLst']
        response = handleInsertClientCourses(clientId, courseLst)
        statusCode = response['ResponseMetadata']['HTTPStatusCode']
        message = 'Insert Successful' if statusCode == 200 else 'Insert Failed'
        return {
            "statusCode": statusCode,
            "body": json.dumps({
                "message": message,
            }),
        }
    
    elif action == 'getClientCourses':
        response = handleGetClientCourses(clientId)
        statusCode = 200 if response['ResponseMetadata']['HTTPStatusCode'] == 200 and 'Item' in response else 400
        message = response['Item']['courseLst'] if statusCode == 200 else []
        print(message)
        return {
            "statusCode": 200,
            "body": json.dumps(message)
        }
    
    elif action == 'getClientSchedule':
        return handleGetClientSchedule(clientId)



    
    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": f"got schedule for {clientId}",
        }),
    }
