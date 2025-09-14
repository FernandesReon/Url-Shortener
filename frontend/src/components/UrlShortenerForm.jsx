import {useState} from "react";
import {createShortUrl} from "../services/mapping.js";

const UrlShortenerForm = () => {
    const [urlData, setUrlData] = useState({
        longUrl: ""
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value} = event.target;
        setUrlData({...urlData, [name]: value});
        setError("")
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (urlData.longUrl.trim() === "") {
            setError("Mention long url.");
            setIsLoading(false);
        }

        setIsLoading(true);
        createShortUrl(urlData)
            .then((response) => {
                console.log("Response: ", response)
                setUrlData({
                    longUrl: ""
                })
            })
            .catch((error) => {
                console.error("Url error: ",error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    return(
        <div className="bg-white rounded-lg p-6 shadow-xl border border-gray-50">
            <h3 className="text-xl font-semibold text-black mb-4">Create Short URL</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="longUrl" className="block text-sm font-medium text-black mb-2">
                        Enter your long URL
                    </label>
                    <input
                        type="url"
                        name="longUrl"
                        id="longUrl"
                        value={urlData.longUrl}
                        onChange={handleChange}
                        placeholder="https://example.com/very-long-url"
                        className="w-full px-4 py-3 bg-white border-2 border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
                        required
                    />
                    {error && <p className="text-md mt-1 font-medium text-red-600">Invalid url. eg: https://www.google.com</p>
                    }
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-500 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                    {isLoading ? "Shortening Url..." : "Shorten Url"}
                </button>
            </form>
        </div>
    )
}

export default UrlShortenerForm;