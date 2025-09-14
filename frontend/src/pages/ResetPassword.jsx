import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Lock } from "lucide-react";

const ResetPassword = () => {
    const { token } = useParams(); // optional, for future use
    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: ""
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ message: "", isError: false });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError({ message: "", isError: false });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password.trim() === "" || formData.confirmPassword.trim() === "") {
            setError({ message: "All fields are required", isError: true });
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError({ message: "Passwords do not match", isError: true });
            return;
        }
        // Placeholder for future resetPassword call
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // In a real implementation you would navigate to a success page or login
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <Lock className="w-6 h-6 mr-2" />
                        Reset Password
                    </h1>
                    <p className="text-gray-600">
                        Choose a new password for your account.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            New Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${
                                error.isError ? "border-red-600 focus:ring-2 focus:ring-red-600" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Enter new password"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${
                                error.isError ? "border-red-600 focus:ring-2 focus:ring-red-600" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Confirm new password"
                        />
                    </div>

                    {error.isError && (
                        <p className="text-red-500 text-sm font-medium">{error.message}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {isLoading ? "Resetting…" : "Reset Password"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Remembered your password?{" "}
                        <Link to="/" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign In
                        </Link>
                    </p>
                    <p className="text-gray-600 mt-2">
                        Need a new reset link?{" "}
                        <Link to="/forgot-password" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Forgot Password
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
