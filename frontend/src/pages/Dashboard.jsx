import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import UrlShortenerForm from "../components/UrlShortenerForm.jsx";
import Analytics_Chart from "../components/Analytics_Chart.jsx";
import URLCard from "../components/URLCard.jsx";
import { fetchAllUrlsInfo } from "../services/mapping.js";
import { modalAnalytics, mainGraph } from "../services/analytics.js";

const Dashboard = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        id: "",
        name: "User",
        email: "",
        role: "user",
    });

    const formatRoles = (roles) => {
        if (!roles) return "user";
        return Array.isArray(roles) ? roles.join(", ") : String(roles);
    };

    useEffect(() => {
        if (user) {
            setUserInfo((prev) => ({
                ...prev,
                id: user.id || "",
                name: user.name || "User",
                email: user.email || "",
                role: formatRoles(user.roles),
            }));
        }
    }, [user]);


    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const [urls, setUrls] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingUrls, setLoadingUrls] = useState(false);
    const [error, setError] = useState(null);

    const [analyticsData, setAnalyticsData] = useState([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);

    const [overallAnalyticsData, setOverallAnalyticsData] = useState([]);
    const [loadingOverallAnalytics, setLoadingOverallAnalytics] = useState(false);

    useEffect(() => {
        const fetchUrls = async () => {
            setLoadingUrls(true);
            setError(null);
            try {
                const response = await fetchAllUrlsInfo(currentPage, 10);
                setUrls(response.content || []);
                setTotalPages(response.totalPages || 0);
            } catch (err) {
                setError("Failed to load URLs");
                console.error(err);
            } finally {
                setLoadingUrls(false);
            }
        };
        fetchUrls();
    }, [currentPage]);

    useEffect(() => {
        const fetchOverallAnalytics = async () => {
            setLoadingOverallAnalytics(true);
            try {
                // Default to last 7 days
                const toDate = new Date();
                const fromDate = new Date();
                fromDate.setDate(fromDate.getDate() - 7);
                const data = await mainGraph(fromDate, toDate);
                // Transform the data to match the expected format
                const transformedData = Object.entries(data).map(([date, clicks]) => ({
                    date,
                    clicks: clicks
                }));
                setOverallAnalyticsData(transformedData);
            } catch (err) {
                console.error("Failed to load overall analytics", err);
                setOverallAnalyticsData([]);
            } finally {
                setLoadingOverallAnalytics(false);
            }
        };
        fetchOverallAnalytics();
    }, []);

    const handleViewAnalytics = async (url) => {
        setSelectedUrl(url);
        setIsModalOpen(true);
        setLoadingAnalytics(true);
        try {
            // Default to last 7 days
            const toDate = new Date();
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - 7);
            const data = await modalAnalytics(url.shortUrl, fromDate, toDate);
            // Transform the data to match the expected format
            const transformedData = data.map(item => ({
                date: item.date,
                clicks: item.count
            }));
            setAnalyticsData(transformedData);
        } catch (err) {
            console.error("Failed to load analytics", err);
            setAnalyticsData([]);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const refetchAnalytics = async (fromDate, toDate) => {
        if (!selectedUrl) return;
        setLoadingAnalytics(true);
        try {
            const data = await modalAnalytics(selectedUrl.shortUrl, fromDate, toDate);
            // Transform the data to match the expected format
            const transformedData = data.map(item => ({
                date: item.date,
                clicks: item.count
            }));
            setAnalyticsData(transformedData);
        } catch (err) {
            console.error("Failed to refetch analytics", err);
            setAnalyticsData([]);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    const refetchOverallAnalytics = async (fromDate, toDate) => {
        setLoadingOverallAnalytics(true);
        try {
            const data = await mainGraph(fromDate, toDate);
            // Transform the data to match the expected format
            const transformedData = Object.entries(data).map(([date, clicks]) => ({
                date,
                clicks: clicks
            }));
            setOverallAnalyticsData(transformedData);
        } catch (err) {
            console.error("Failed to refetch overall analytics", err);
            setOverallAnalyticsData([]);
        } finally {
            setLoadingOverallAnalytics(false);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUrl(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 fill-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Unable to load user data. Please try logging in again.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-white flex flex-col">
            <div className="flex-1 px-8 py-8 overflow-auto">
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">URL Shortener</h1>
                        <p className="text-muted-foreground">Create short URLs and track their performance</p>
                    </div>
                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-semibold hover:bg-indigo-700 transition-colors cursor-pointer"
                        >
                            {userInfo.name.charAt(0).toUpperCase()}
                        </button>
                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 max-w-fit bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                <div className="py-1">
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <p className="text-md font-medium text-gray-900">{userInfo.name}</p>
                                        <p className="text-sm text-gray-500">{userInfo.email}</p>
                                    </div>
                                    <div className="border-t border-gray-100">
                                        <button
                                            onClick={logout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                        {isDropdownOpen && <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />}
                    </div>
                </div>
                <div className="mb-8">
                    <UrlShortenerForm />
                </div>
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-black mb-4">Overall Analytics</h1>
                    <Analytics_Chart data={overallAnalyticsData} onDateChange={refetchOverallAnalytics} />
                </div>

                <div className="flex-1">
                    <h1 className="text-4xl font-bold text-black mb-4">Your URLs</h1>
                    {loadingUrls ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading URLs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <p className="text-red-600">{error}</p>
                        </div>
                    ) : urls.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600">No URLs found. Create your first short URL above!</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                                {urls.map((url) => (
                                    <URLCard key={url.id} url={url} onViewAnalytics={handleViewAnalytics} />
                                ))}
                            </div>
                            {/* Pagination */}
                            <div className="flex justify-center items-center mt-8 space-x-4">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                                    disabled={currentPage === 0}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600"
                                >
                                    Previous
                                </button>
                                <span className="text-gray-600">
                                    Page {currentPage + 1} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                                    disabled={currentPage >= totalPages - 1}
                                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-indigo-600"
                                >
                                    Next
                                </button>
                            </div>
                        </>
                    )}
                </div>

            </div>

            {/* Analytics Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold text-black">Analytics for {selectedUrl?.shortUrl}</h2>
                            <button
                                onClick={handleCloseModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        {loadingAnalytics ? (
                            <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                                <p className="mt-2 text-gray-600">Loading analytics...</p>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* URL Details */}
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-3 h-3 rounded-full ${selectedUrl.active ? "bg-green-600" : "bg-red-600"}`} />
                                            <span className={`text-sm font-medium ${selectedUrl.active ? "text-green-600" : "text-red-600"}`}>
                                                {selectedUrl.active ? "Active" : "Inactive"}
                                            </span>
                                        </div>
                                        <span className="text-sm text-black">Created {new Date(selectedUrl.createdOn).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}</span>
                                    </div>

                                    <div className="space-y-3 mb-4">
                                        <div>
                                            <label className="text-sm font-medium text-black uppercase tracking-wide">Original URL</label>
                                            <p className="text-sm text-gray-500 mt-1" title={selectedUrl.longUrl}>
                                                {selectedUrl.longUrl.length > 60 ? `${selectedUrl.longUrl.substring(0, 60)}...` : selectedUrl.longUrl}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-black uppercase tracking-wide">Short URL</label>
                                            <p className="text-sm font-medium text-indigo-500 mt-1">{selectedUrl.shortUrl}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                        <div className="flex items-center space-x-4">
                                            <div className="text-center">
                                                <p className="text-2xl font-bold text-black">{selectedUrl.clickedCounts.toLocaleString()}</p>
                                                <p className="text-xs text-black">Total Clicks</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Analytics Chart */}
                                <Analytics_Chart data={analyticsData} onDateChange={refetchAnalytics} />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
