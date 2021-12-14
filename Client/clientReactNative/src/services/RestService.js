export const excecutePost = async (name, body, endpoint) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            body: body
        });
        if(response.status === 200) {
            return response.json()
        }
        console.log(response.json())
        return name + ' failed with status code ' + response.status
    } catch (error) {
        console.error(error);
        return error
    }
};

export const getUser = async (emailAddress) => {
    body = JSON.stringify({
        "emailAddress": emailAddress,
        "action": "getUser"
    });
    return await excecutePost('getUser', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/users')
};
export const getSchedule = async (clientId) => {
    body = JSON.stringify({
        "clientId": clientId,
        "action": "getClientSchedule"
    });
    return await excecutePost('getSchedule', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/courses')
};

export const getCourses = async (clientId) => {
    body = JSON.stringify({
        "clientId": clientId,
        "action": "getClientCourses"
    });
    return await excecutePost('getCourses', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/courses')
};

export const setCourses = async (clientId, courseLst) => {
    body = JSON.stringify({
        "clientId": clientId,
        "action": "insertClientCourses",
        "courseLst": courseLst
    });
    return await excecutePost('setCourses', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/courses')
};

export const getEmails = async (clientId) => {
    body = JSON.stringify({
        "clientId": clientId,
        "action": "getClientEmails"
    });
    return await excecutePost('getEmails', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/emails')
};

export const sendEmail = async (clientId, emailInfo) => {
    body = JSON.stringify({
        "clientId": clientId,
        "action": "sendEmail",
        "emailInfo": emailInfo
    });
    return await excecutePost('sendEmail', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/emails')
};

export const getMenu = async (week) => {
    body = JSON.stringify({
        "week": week,
        "action": "getMenu"
    });
    return await excecutePost('getMenu', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/menu')
};

export const getActivities = async (id) => {
    body = JSON.stringify({
        "id": id,
        "action": "getActivities"
    });
    return await excecutePost('getActivities', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/activities')
};

export const getEvents = async () => {
    body = JSON.stringify({
        "id": "1",
        "action": "getEvents"
    });
    return await excecutePost('getEvents', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/events')
};

export const insertEvents = async (eventsLst) => {
    body = JSON.stringify({
        "id": "1",
        "action": "insertEvents",
        "eventsLst": eventsLst
    });
    return await excecutePost('insertEvents', body, 'https://5pd668ex11.execute-api.us-east-1.amazonaws.com/Prod/events')
};
