import {useEffect, useState} from "react";
import {accountVerification, resendVerificationCode} from "../services/registration.js";
import {useLocation, useNavigate} from "react-router-dom";

const AccountVerificationPage = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const [code, setCode] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        if (!email) {
            navigate("/register");
        }
    }, [email, navigate]);

    const handleChange = (event) => {
        setCode(event.target.value);
        setError("");
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const pattern = /^[A-Za-z0-9]{6}$/;
        if (!pattern.test(code)) {
            setError("Please enter a valid 6-character alphanumeric code.")
            return;
        }
        setIsLoading(true);
        try {
            await accountVerification(email, code);
            navigate("/", { replace:true });
        } catch (error) {
            setError(error.response?.data?.message || "Failed to resend code. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleResend = async () => {
        try {
            console.log("Resend code requested");
            setCountdown(60);
            setError("");
            await resendVerificationCode(email);
        }
        catch (err) {
            setError("Failed to resend code. Please try again.");
            console.error(err);
        }
    }

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Enter verification code</h1>
                    <p className="text-gray-600">A 6‑digit alphanumeric code was sent to your email.</p>
                    <p className="text-indigo-700 font-medium">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Verification Code</label>
                        <input
                            type="text"
                            name="code"
                            value={code}
                            onChange={handleChange}
                            maxLength={6}
                            className={`w-full px-4 py-3 border ${error ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} ${code ? 'text-xl font-medium' : ''} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Enter code"
                        />
                        {error && <p className="block text-sm font-medium text-red-600 mt-1">{error}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    {countdown > 0 ? (
                        <p className="text-gray-600 text-center">Resend code in {countdown}s</p>
                    ) : (
                        <button
                            type="button"
                            onClick={handleResend}
                            className="w-full mt-1 bg-gray-300 text-gray-800 py-2 px-4 rounded"
                        >
                            Resend code
                        </button>
                    )}
                </form>
            </div>
        </div>
    )
}

export default AccountVerificationPage;