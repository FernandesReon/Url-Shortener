import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const OtpVerification = () => {
    const [otp, setOtp] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({ message: "", isError: false });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setOtp(event.target.value);
        setError({ message: "", isError: false });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (otp.trim() === "") {
            setError({ message: "OTP is required", isError: true });
            return;
        }
        // Placeholder for future OTP verification call
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            // After successful verification, navigate to reset password UI
            navigate("/reset-password");
        }, 1000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 mr-2" />
                        Verify OTP
                    </h1>
                    <p className="text-gray-600">
                        Enter the OTP sent to your email address.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            OTP Code
                        </label>
                        <input
                            type="text"
                            name="otp"
                            value={otp}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${
                                error.isError ? "border-red-600 focus:ring-2 focus:ring-red-600" : "border-gray-300"
                            } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Enter OTP"
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
                        {isLoading ? "Verifying…" : "Verify OTP"}
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

export default OtpVerification;
