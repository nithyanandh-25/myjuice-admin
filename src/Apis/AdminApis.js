import axios from 'axios';

const AdminUrl = "http://localhost:8080/admins";

export const getAdmins = async () => {
    const response = await axios.get(AdminUrl);
    return response.data;
}

export const postRegister = async (name, mobilenumber, password) => {
    const response = await axios.post(`${AdminUrl}/register`, {
        name,
        mobilenumber,
        password,
    }, {
        headers: {
            'Content-Type': 'application/json', // Ensure content type is JSON
        },
    });
    return response.data; // Return the response data
}

export const postLogin = async (mobilenumber, password) => {
    const response = await axios.post(`${AdminUrl}/login`, {
        mobilenumber,
        password,
    }, {
        headers: {
            'Content-Type': 'application/json', // Ensure content type is JSON
        },
    });
    return response.data; // Return the response data
}
