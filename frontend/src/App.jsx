import { Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegistrationPage from "./pages/RegistrationPage.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Admin_Panel from "./pages/Admin_Panel.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const App = () => {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="register" element={<RegistrationPage />} />
                <Route path="user">
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                </Route>
                <Route path="admin">
                    <Route
                        path="dashboard"
                        element={
                            <ProtectedRoute adminOnly={true}>
                                <Admin_Panel />
                            </ProtectedRoute>
                        }
                    />
                </Route>

            </Routes>
        </AuthProvider>
    );
};

export default App;