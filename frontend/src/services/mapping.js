import {axiosInstance} from "./api.js";

const shortenUrl = import.meta.env.VITE_URL_SHORTEN;
const fetchUrls = import.meta.env.VITE_URL_FETCH_INFO;

export const createShortUrl = async (longUrl) => {
    try {
        const response = await axiosInstance.post(shortenUrl, longUrl);
        return response.data;
    } catch (error) {
        console.error("Unexpected error occurred while shortening longUrl:", longUrl);
        throw error;
    }
}

export const fetchAllUrlsInfo = async (page = 0, size = 10) => {
    try {
        const response = await axiosInstance.get(`${fetchUrls}?page=${page + 1}&${size}`);
        return response.data;
    } catch (error) {
        console.error("Unexcepted error while fetch urls information");
        throw error;
    }
}