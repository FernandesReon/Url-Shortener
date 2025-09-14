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

export const accountVerification = async (email, code) => {
    try {
        const response = await axiosInstance.post(
            accountVerificationUrl,
            { verificationCode: code },
            { params: { email }}
        );
        return response.data;
    } catch (error) {
        console.error("Unexpected error occurred while verifying the account");
        throw error;
    }
}

export const resendVerificationCode = async (email) => {
    try {
        const response = await axiosInstance.post(
            resendVerificationCodeUrl,
            null,
            { params: { email }}
        );
        return response.data;
    } catch (error) {
        console.error("Unexpected error occurred while resending verification code.");
        throw error;
    }
}