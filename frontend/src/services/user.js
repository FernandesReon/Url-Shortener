import {axiosInstance} from "./api.js";

const profileUrl = import.meta.env.VITE_AUTH_PROFILE;

export const userProfile = async() => {
    try {
        const response = await axiosInstance.get(profileUrl);
        return response.data;
    } catch (error) {
        console.error("Unexpected error while fetching user profile.");
        throw error;
    }
}
