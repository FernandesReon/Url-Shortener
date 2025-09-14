import {axiosInstance} from "./api.js";

const authenticationUrl = import.meta.env.VITE_AUTH_LOGIN;

export const authentication = async (credentials) => {
    try {
        const response = await axiosInstance.post(authenticationUrl, credentials);
        return response.data;
    } catch (error) {
        console.error("Unexpected error while authenticating user");
        throw error;
    }
}