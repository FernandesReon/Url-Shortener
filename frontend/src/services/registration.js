import {axiosInstance} from "./api.js";

const registrationUrl = import.meta.env.VITE_AUTH_REGISTER;
const accountVerificationUrl = import.meta.env.VITE_AUTH_ACCOUNT_VERIFY;
const resendVerificationCodeUrl = import.meta.env.VITE_AUTH_RESEND_CODE;

export const registration = async (userData) => {
    try {
        const response = await axiosInstance.post(registrationUrl, userData);
        return response.data;
    } catch (error) {
        console.error("Unexpected error occurred during registration.")
        throw error;
    }
}