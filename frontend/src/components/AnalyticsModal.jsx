import { useEffect, useRef, useState } from "react";
import { modalAnalytics } from "../services/analytics.js";
import { Copy, Check, X } from "lucide-react";

const AnalyticsModal = ({ url, isOpen, onClose }) => {
    const canvasRef = useRef(null);
    const chartRef = useRef(null);

    // State for modal analytics
    const [analyticsData, setAnalyticsData] = useState([]);
    const [loadingAnalytics, setLoadingAnalytics] = useState(false);
    const [error, setError] = useState(null);
    const [copied, setCopied] = useState(false);

    // Date range state
    const [dateFrom, setDateFrom] = useState(() => {
        const today = new Date();
        const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        return firstDayOfMonth.toISOString().split("T")[0];
    });

    const [dateTo, setDateTo] = useState(() => {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        return tomorrow.toISOString().split("T")[0];
    });

    // Copy short URL to clipboard
    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text: ", error);
        }
    };

    // Fetch analytics for specific URL
    const fetchModalAnalytics = async (from = null, to = null) => {
        if (!url || !url.shortUrl) {
            setError("No valid URL provided");
            setAnalyticsData([]);
            setLoadingAnalytics(false);
            return;
        }
        setLoadingAnalytics(true);
        setError(null);
        try {
            const shortUrlKey = url.shortUrl.split("/").pop();
            console.log("Fetching analytics for shortUrl:", shortUrlKey, "from:", from, "to:", to);
            const data = await modalAnalytics(shortUrlKey, from, to);
            console.log("Raw analytics data:", data);

            // Transform data using date and count directly
            const transformedData = data.map(item => ({
                date: item.date,
                clicks: item.count || 0 // Use count as clicks, default to 0 if missing
            })).sort((a, b) => new Date(a.date) - new Date(b.date));

            console.log("Transformed analytics data:", transformedData);
            setAnalyticsData(transformedData);
        } catch (err) {
            console.error("Failed to load URL analytics:", err);
            setError("Failed to load analytics. Please try again.");
            setAnalyticsData([]);
        } finally {
            setLoadingAnalytics(false);
        }
    };

    // Initial fetch on modal open / URL change
    useEffect(() => {
        if (isOpen && url) {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            fetchModalAnalytics(firstDayOfMonth, tomorrow);
        }
    }, [url, isOpen]);

    const handleDateChange = async (from, to) => {
        setDateFrom(from.toISOString().split("T")[0]);
        setDateTo(to.toISOString().split("T")[0]);
        await fetchModalAnalytics(from, to);
    };

    // Chart rendering
    useEffect(() => {
        if (!isOpen || !url) return;

        const loadChart = async () => {
            const { Chart, registerables } = await import("chart.js");
            Chart.register(...registerables);

            if (canvasRef.current) {
                if (chartRef.current) chartRef.current.destroy();

                const ctx = canvasRef.current.getContext("2d");
                if (!ctx) {
                    console.error("Failed to get canvas context");
                    return;
                }

                // Filter data based on current date range
                const filteredData = analyticsData.filter((item) => {
                    const itemDate = new Date(item.date);
                    const fromDate = new Date(dateFrom);
                    const toDate = new Date(dateTo);
                    return itemDate >= fromDate && itemDate <= toDate;
                }).sort((a, b) => new Date(a.date) - new Date(b.date));

                console.log("Filtered data for chart:", filteredData);

                chartRef.current = new Chart(ctx, {
                    type: "line",
                    data: {
                        labels: filteredData.map((d) => {
                            const date = new Date(d.date);
                            return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                        }),
                        datasets: [
                            {
                                label: "Clicks",
                                data: filteredData.map((d) => d.clicks),
                                borderColor: "#4f46e5",
                                backgroundColor: "rgba(79, 70, 229, 0.1)",
                                borderWidth: 3,
                                fill: true,
                                tension: 0.4,
                                pointBackgroundColor: "#4f46e5",
                                pointBorderColor: "#4f46e5",
                                pointRadius: 6,
                                pointHoverRadius: 8,
                            },
                        ],
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: { display: false },
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: { color: "#e5e7eb" },
                                ticks: { color: "#000000", font: { size: 12 } },
                            },
                            x: {
                                grid: { display: false },
                                ticks: { color: "#000000", font: { size: 12 } },
                            },
                        },
                    },
                });
            }
        };

        loadChart();

        return () => {
            if (chartRef.current) chartRef.current.destroy();
        };
    }, [analyticsData, dateFrom, dateTo, isOpen, url]);

    if (!isOpen || !url) return null;

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateUrl = (urlStr, maxLength = 60) => {
        return urlStr.length > maxLength ? `${urlStr.substring(0, maxLength)}...` : urlStr;
    };

    const totalClicksInRange = analyticsData.reduce((sum, d) => sum + d.clicks, 0);

    return (
        <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-black">Analytics for Short URL</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* URL Details */}
                <div className="p-6 border-b border-gray-200 space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-black">Short URL</h3>
                        <div className="flex items-center space-x-2">
                            <a
                                href={
                                    url.shortUrl?.startsWith("http")
                                        ? url.shortUrl
                                        : `${window.location.origin}/${url.shortUrl}`
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-indigo-500 underline"
                            >
                                {url.shortUrl}
                            </a>
                            <button
                                onClick={() => copyToClipboard(url.shortUrl)}
                                className="p-1 hover:bg-gray-100 rounded transition-colors"
                                title="Copy to clipboard"
                            >
                                {copied ? (
                                    <Check className="w-4 h-4 text-indigo-500" />
                                ) : (
                                    <Copy className="w-4 h-4 text-black" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-sm font-medium text-black uppercase tracking-wide">
                                Original URL
                            </label>
                            <p className="text-sm text-gray-500 mt-1" title={url.longUrl}>
                                {truncateUrl(url.longUrl)}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-black uppercase tracking-wide">
                                Created
                            </label>
                            <p className="text-sm text-gray-500 mt-1">
                                {formatDate(url.createdOn)}
                            </p>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-black uppercase tracking-wide">
                                Status
                            </label>
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                    url.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                }`}
                            >
                                {url.isActive ? "Active" : "Inactive"}
                            </span>
                        </div>

                        <div>
                            <label className="text-sm font-medium text-black uppercase tracking-wide">
                                Total Clicks (All Time)
                            </label>
                            <p className="text-2xl font-bold text-black mt-1">
                                {url.clickedCounts.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Analytics Chart Section */}
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-black">Click Analytics</h3>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-black">From:</label>
                                <input
                                    type="date"
                                    value={dateFrom}
                                    max={dateTo}
                                    onChange={(e) => {
                                        const newFrom = new Date(e.target.value);
                                        handleDateChange(newFrom, new Date(dateTo));
                                    }}
                                    className="px-3 py-1 border border-gray-400 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <label className="text-sm text-black">To:</label>
                                <input
                                    type="date"
                                    value={dateTo}
                                    min={dateFrom}
                                    onChange={(e) => {
                                        const newTo = new Date(e.target.value);
                                        handleDateChange(new Date(dateFrom), newTo);
                                    }}
                                    className="px-3 py-1 border border-gray-400 rounded text-sm text-black focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                                />
                            </div>
                        </div>
                    </div>

                    {loadingAnalytics ? (
                        <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                            <p className="mt-2 text-gray-600">Loading analytics...</p>
                        </div>
                    ) : error ? (
                        <p className="text-red-600 text-center py-8">{error}</p>
                    ) : analyticsData.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No clicks in this period yet.</p>
                    ) : (
                        <>
                            <div className="relative h-64 mb-4">
                                <canvas ref={canvasRef} className="w-full h-full"></canvas>
                            </div>
                            <div className="text-center">
                                <span className="text-sm text-black">
                                    Total Clicks in Range: {totalClicksInRange}
                                </span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnalyticsModal;