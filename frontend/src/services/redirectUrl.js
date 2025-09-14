import {axiosInstance} from "./api.js";

const redirectUrl = import.meta.env.VITE_URL_ANALYTICS_REDIRECT;

export const urlRedirect = async (short) => {
    try {
        const response = await axiosInstance.get(redirectUrl, short);
        return response.data;
    } catch (error) {
        console.error("Unexpected error occurred while redirecting url");
        throw error;
    }
}