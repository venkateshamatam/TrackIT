import axios from 'axios';
import { getBaseUrl } from '../../config.js';
const BASE_URL = getBaseUrl();

const headers = { "content-type": "application/json" }

// Axios API Call to get all Projects
export const getAllProjects = async () => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects`,
            method: 'GET',
            headers: headers
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
        return []
    }
};

// Axios API Call to create a Project
export const createProject = async (project) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects`,
            method: 'POST',
            header: headers,
            data: project
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to update a Project
export const updateProject = async (project, projectId) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}`,
            method: 'PUT',
            header: headers,
            data: project
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }

}

// Axios API Call to Delete a Project
export const deleteProjectById = async (projectId, isProjectAdmin) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}?isProjectAdmin=${isProjectAdmin}`,
            method: 'DELETE',
            header: headers,
        })
        console.log(res.data)
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get Project Admin
export const getAdminById = async (projectId) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get all project users
export const getAllUsersByProjectId = async (projectId) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/users`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get all project tasks
export const getAllTasksByProjectId = async (projectId) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/tasks`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get all project tasks for a given user
export const getAllUserTasksByProjectId = async (projectId, userId) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/users/${userId}`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to delete user from project
export const removeUserFromProject = async (projectId, userId, isProjectAdmin) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/users/${userId}?isProjectAdmin=${isProjectAdmin}`,
            method: 'DELETE',
            header: headers,
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to create a Task, given a projectId
export const createTask = async (data, projectId) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/tasks`,
            method: 'POST',
            header: headers,
            data: data
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }

}

// Axios API Call to update a Task, given a projectId, task payload
export const updateTask = async (task, projectId, taskId) => {

    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/tasks/${taskId}`,
            method: 'PUT',
            header: headers,
            data: task
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to delete a Task, given a projectId, taskId
export const deleteTask = async (projectId, taskId) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/tasks/${taskId}`,
            method: 'DELETE',
            header: headers,
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get task status counts for a given projectId
export const getTasksAnalytics = async (projectId) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/tasks/analytics`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}

// Axios API Call to get task status counts for a given projectId and a user
export const getUserTasksAnalytics = async (projectId, userId) => {
    try {
        const res = await axios({
            url: `${BASE_URL}/projects/${projectId}/users/${userId}/tasks/analytics`,
            method: 'GET',
        })
        return res.data
    } catch (err) {
        console.error("axios catch error: ", err)
    }
}




