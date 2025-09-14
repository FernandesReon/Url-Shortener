import {axiosInstance} from "./api.js";

const analytics_chart = import.meta.env.VITE_URL_ANALYTICS_CHART;
const analytics_modal = import.meta.env.VITE_URL_ANALYTICS_MODAL;


const formatDateTime = (date) => {
    if (!date) return null;
    return new Date(date).toISOString().slice(0,19);
}

export const mainGraph = async (from = null, to = null) => {
    try {
        const params = {};
        if (from) params.from = formatDateTime(from);
        if (to) params.to = formatDateTime(to);

        const response = await axiosInstance.get(analytics_chart, { params });
        return response.data;
    } catch (error) {
        console.error("Unexpected error while display overall analytics (main graph)");
        throw error;
    }
}

export const modalAnalytics = async (shortUrl, from = null, to = null) => {
    try {
        const params = {};
        if (from) params.from = formatDateTime(from);
        if (to) params.to = formatDateTime(to);

        const response = await axiosInstance.get(`${analytics_modal}/${shortUrl}`, { params });
        return response.data;
    } catch (error) {
        console.error("Unexpected error while display specific shortUrl analytics");
        throw error;
    }
}