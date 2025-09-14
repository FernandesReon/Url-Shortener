import {useContext, useState} from "react";
import {Link} from "react-router-dom";
import {AuthContext} from "../context/AuthContext.jsx";

const LoginPage = () => {
    const { login } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState({
        errors: {},
        isError: false
    });

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError({ errors: {}, isError: false });
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (formData.email.trim() === "") {
            setError({ errors: { email: "Mention you email address" }, isError: true });
            setIsLoading(false);
            return
        }
        else if (formData.password.trim() === "") {
            setError({ errors: { password: "Kindly enter your password" }, isError: true });
            setIsLoading(false);
            return
        }

        setIsLoading(true);
        try {
            await login(formData);
            setFormData({
                email: "",
                password: ""
            });
        } catch (error) {
            if (error.response?.data) {
                setError({
                    errors: error.response.data,
                    isError: true,
                })
            } else if (error.response?.status === 401) {
                setError({
                    errors: { credentials: "Provided credentials are incorrect." },
                    isError: true
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
                    <p className="text-gray-600">Log in to manage your short links and view analytics.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your email"
                        />
                        {error.errors.email && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                            placeholder="Enter your password"
                        />
                        {error.errors.password && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.password}</p>}
                        {error.errors.credentials && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.credentials}</p>}
                        {error.errors.disabled && <p className="text-red-500 text-sm font-medium mt-1">{error.errors.disabled}</p>}

                        <Link to="/forgot-password" className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium block text-right">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        {"Don't have an account? "}
                        <Link to="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;