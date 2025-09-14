import {useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import {registration} from "../services/registration.js";

const RegistrationPage = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState({
        errors: {},
        isError: false
    });

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
        setError({ errors: {}, isError: false});
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        registration(formData)
            .then((response) => {
            console.log("Response", response);

            navigate("/verify", { state: { email: formData.email } });

            setFormData({
                name: "",
                email: "",
                password: "",
            })
        })
            .catch((error) => {
                console.error("Error", error);
                setError({
                    errors: error,
                    isError: true
                })
            })
            .finally(() => {
                setIsLoading(false);
            })
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white-50 to-indigo-500 p-3">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
                    <p className="text-gray-600">Register to save your links and access detailed analytics</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${error.errors?.response?.data?.name ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Name: "
                            autoComplete="off"
                        />
                        {error.errors?.response?.data?.name && <p className="block text-sm font-medium text-red-600 mt-1">{error.errors.response.data.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${error.errors?.response?.data?.email ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Email: "
                            autoComplete="off"
                        />
                        {error.errors?.response?.data?.email && <p className="block text-sm font-medium text-red-600 mt-1">{error.errors.response.data.email}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className={`w-full px-4 py-3 border ${error.errors?.response?.data?.password ? 'border-red-600 focus:ring-2 focus:ring-red-600' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all`}
                            placeholder="Password:"
                            autoComplete="off"
                        />
                        {error.errors?.response?.data?.password && <p className="block text-sm font-medium text-red-600 mt-1">{error.errors.response.data.password}</p>}
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium cursor-pointer"
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-600">
                        Already have an account?{' '}
                        <Link to={"/"} className="text-indigo-600 hover:text-indigo-700 font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default RegistrationPage;