import { axiosInstance } from "./api.js";

const analytics_chart = import.meta.env.VITE_URL_ANALYTICS_CHART;
const analytics_modal = import.meta.env.VITE_URL_ANALYTICS_MODAL;

const formatDateTime = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0, 19);
};

export const mainGraph = async (from = null, to = null) => {
    try {
        const params = {};
        if (from) params.from = formatDateTime(from);
        if (to) params.to = formatDateTime(to);

        const response = await axiosInstance.get(analytics_chart, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching overall analytics:", error);
        throw error;
    }
};

export const modalAnalytics = async (shortUrl, from = null, to = null) => {
    try {
        const params = {};
        if (from) params.from = formatDateTime(from);
        if (to) params.to = formatDateTime(to);

        console.log("Sending request to:", `${analytics_modal}/${shortUrl}`, "with params:", params);
        const response = await axiosInstance.get(`${analytics_modal}/${shortUrl}`, { params });
        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error(`Error fetching analytics for ${shortUrl}:`, error);
        throw error;
    }
};