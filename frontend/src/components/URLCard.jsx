import { Check, Copy } from "lucide-react";
import { useState } from "react";

const URLCard = ({ url, onViewAnalytics }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = async (text) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (error) {
            console.error("Failed to copy text: ", error);
        }
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const truncateUrl = (url, maxLength = 50) => {
        return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url;
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-md transition-shadow">
            {/* Header with status */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                    <div
                        className={`w-3 h-3 rounded-full ${
                            url.active ? "bg-green-600" : "bg-red-600"
                        }`}
                    />
                    <span
                        className={`text-sm font-medium ${
                            url.active ? "text-green-600" : "text-red-600"
                        }`}
                    >
            {url.active ? "Active" : "Inactive"}
          </span>
                </div>
                <span className="text-sm text-black">
          Created {formatDate(url.createdOn)}
        </span>
            </div>

            {/* URLs */}
            <div className="space-y-3 mb-4">
                <div>
                    <label className="text-sm font-medium text-black uppercase tracking-wide">
                        Original URL
                    </label>
                    <p
                        className="text-sm text-gray-500 mt-1"
                        title={url.longUrl}
                    >
                        {truncateUrl(url.longUrl, 60)}
                    </p>
                </div>

                <div>
                    <label className="text-sm font-medium text-black uppercase tracking-wide">
                        Short URL
                    </label>
                    <div className="flex items-center space-x-2 mt-1">
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
            </div>

            {/* Stats and Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-black">
                            {url.clickedCounts.toLocaleString()}
                        </p>
                        <p className="text-xs text-black">Total Clicks</p>
                    </div>
                </div>

                <div className="flex items-center space-x-2">
                    <button
                        onClick={() => onViewAnalytics(url)}
                        className="px-4 py-2 bg-indigo-500 text-white text-sm font-medium rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        View Analytics
                    </button>
                </div>
            </div>
        </div>
    );
};

export default URLCard;
