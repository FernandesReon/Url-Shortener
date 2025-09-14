import {createContext, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {userProfile} from "../services/user.js";
import {axiosInstance} from "../services/api.js";
import {authentication} from "../services/authentication.js";

export const AuthContext = createContext();
const logoutUrl = import.meta.env.VITE_AUTH_LOGOUT;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    const fetchUserProfile = async () => {
        try {
            const profileData = await userProfile();
            console.log("Fetched profile data:", profileData);
            setUser(profileData);
            setIsAuthenticated(true);
            return profileData;
        } catch (error) {
            if (error.response?.status !== 401 && error.response?.status !== 403) {
                console.error("Failed to fetch user profile:", error);
            }
            setUser(null);
            setIsAuthenticated(false);
            throw error;
        }
    };

    const login = async (credentials) => {
        try {
            await authentication(credentials);
            const profile = await fetchUserProfile();
            if (profile) {
                if (profile.roles?.includes("ADMIN")) {
                    navigate("/admin/dashboard");
                } else {
                    navigate("/user/dashboard");
                }
            } else {
                console.error("Failed to fetch user profile");
            }
        } catch (error) {
            console.error("Unexpected error while authenticating user.");
            throw error;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post(logoutUrl);
            setUser(null);
            setIsAuthenticated(false);
            navigate("/");
        } catch (error) {
            console.error("Unexpected error while logging out.", error);
        }
    };

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                console.log("Checking for authentication ....");
                await fetchUserProfile();
            } catch (error) {
                console.error("Authentication error: ", error);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, fetchUserProfile, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};