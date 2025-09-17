import {axiosInstance} from "./api.js";

const fetchUsersUrl = import.meta.env.VITE_FETCH_USERS;
const fetchUserByEmailUrl = import.meta.env.VITE_FETCH_USER_BY_EMAIL;

export const fetchAllUsers = async (pageNo = 0, pageSize = 10) => {
    try {
        const response = await axiosInstance.get(`${fetchUsersUrl}?pageNo=${pageNo + 1}&pageSize=${pageSize}`);
        return response.data;
    } catch (error) {
        console.error("Unexpected error while fetching users list.");
        throw error;
    }
}

export const fetchUserByEmail = async (email) => {
    try {
        const response = await axiosInstance.get(`${fetchUserByEmailUrl}/${email}`);
        return response.data;
    } catch (error) {
        console.error("Unexpected error while fetching user via email.");
        throw error;
    }
}
