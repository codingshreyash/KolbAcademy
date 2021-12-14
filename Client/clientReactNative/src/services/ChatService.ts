
export const excecutePost = async (name: string, endpoint: string) => {
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
        });
        if(response.status === 200) {
            return response.json()
        }
        return name + ' failed with status code ' + response.status
    } catch (error) {
        return error
    }
};

export const createRoom = async () => {
    return await excecutePost('createRoom', 'https://8m4m9yyek4.execute-api.us-east-1.amazonaws.com/Prod/AddRoom')
};

