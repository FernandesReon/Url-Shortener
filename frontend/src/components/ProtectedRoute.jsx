import { useContext } from "react";
import {Navigate} from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, user, isLoading } = useContext(AuthContext);
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    // if (adminOnly && !(user?.roles?.includes("ADMIN") && user?.role === "ADMIN")) {
    //     return <Navigate to="/user/dashboard" replace />;
    // }
    if (adminOnly && !user?.roles?.includes("ADMIN")) {
        return <Navigate to="/user/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
