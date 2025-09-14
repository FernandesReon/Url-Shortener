import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail } from "lucide-react";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ message: "", isError: false });

    const handleChange = (event) => {
        setEmail(event.target.value);
        setError({ message: "", isError: false });
    };

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (email.trim() === "") {
            setError({ message: "Email is required", isError: true });
            return;
        }
        // Placeholder for future sendResetPasswordOtp call
        setIsLoading(true);
        // Simulate async behavior
        setTimeout(() => {
            setIsLoading(false);
            // Navigate to OTP verification UI
            navigate("/forgot-password/verify");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <Mail className="w-6 h-6 mr-2" />
                        Forgot Password
                    </h1>
                    <p className="text-gray-600">
                        Enter your email address to receive a password reset link.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${
                                error.isError ? "border-red-600 focus:ring-2 focus:ring-red-600" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Enter your email"
                        />
                        {error.isError && (
                            <p className="text-red-500 text-sm font-medium mt-1">{error.message}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {isLoading ? "Sending OTP…" : "Send Reset Link"}
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
                        New to the platform?{" "}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Create an account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
