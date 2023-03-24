import axios from 'axios';
import { getBaseUrl } from '../../config.js';

const BASE_URL = getBaseUrl();
const headers = { 'content-type': 'application/json' };

//AXIOS API Call for retrieving all Users
export const getAllRegisteredUsers = async () => {
    try {
        const res = await axios({
            url: `${BASE_URL}/users`,
            method: 'GET',
            header: headers
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
        return []
    }
};

//Axios API Call for LogIn Authentication
export const loginUser = async (form_data) => {
    return axios({
        url: `${BASE_URL}/users/login`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: form_data
    })
}

//Axios API Call to Register New User
export const registerUser = async (form_data) => {
    return axios({
        url: `${BASE_URL}/users/register`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: form_data
    })
}

//Axios API call for OTP Verification
export const otpVerification = async (form_data) => {
    return axios({
        url: `${BASE_URL}/users/email`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        data: form_data
    })
}

//Axios API call for Sending OTP
export const sendOTP = async (form_data) => {
    return axios({
        url: `${BASE_URL}/users/email`,
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        data: form_data
    })
}

//Axios API Call to Update User details
export const updateUserDetails = async (userId, token, form_data) => {
    return axios({
        url: `${BASE_URL}/users/${userId}`,
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        data: form_data
    })
}
