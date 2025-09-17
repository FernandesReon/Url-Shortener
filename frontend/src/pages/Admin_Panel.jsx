import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import { fetchAllUsers, fetchUserByEmail } from "../services/admin.js";

const Admin_Panel = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        id: "",
        name: "",
        email: "",
        role: "",
    });

    const formatRoles = (roles) => {
        if (!roles) return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">user</span>;
        const roleStyles = {
            USER: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
            ADMIN: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
        };
        return Array.isArray(roles) ? (
            roles.map((role, index) => (
                <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-1 ${roleStyles[role] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}`}
                >
                {role}
            </span>
            ))
        ) : (
            <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleStyles[roles] || "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"}`}
            >
            {roles}
        </span>
        );
    };

    const formatDate = (dateString) => {
        const options = {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        };
        return new Date(dateString).toLocaleDateString(undefined, options);
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

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [users, setUsers] = useState([]);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const usersPerPage = 10;

    // pagination
    const goToPage = (page) => {
        if (page >= 0 && page < totalPages) {
            setCurrentPage(page);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 0) {
            setCurrentPage(currentPage - 1);
        }
    };

    // fetch all users from backend
    useEffect(() => {
        if (!isSearching) {
            const loadUsers = async () => {
                try {
                    const data = await fetchAllUsers(currentPage, usersPerPage);
                    setUsers(data.content || []);
                    setTotalPages(data.totalPages || 0);
                } catch (err) {
                    console.error("Failed to fetch users", err);
                }
            };
            loadUsers();
        }
    }, [currentPage, isSearching]);

    // search handler
    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchTerm.trim()) return;

        try {
            setIsSearching(true);
            const userData = await fetchUserByEmail(searchTerm.trim());
            // Convert single user object to array to maintain consistent rendering
            setSearchResults([userData]);
        } catch (err) {
            console.error("Failed to search user", err);
            // Reset search results on error
            setSearchResults([]);
        }
    };

    // clear search handler
    const handleClearSearch = () => {
        setSearchTerm("");
        setSearchResults([]);
        setIsSearching(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading admin panel...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen w-screen bg-white flex flex-col">
            <div className="flex-1 px-8 py-8 overflow-auto">
                {/* Header */}
                <div className="mb-8 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
                        <p className="text-muted-foreground">Manage users and system settings</p>
                    </div>

                    {/* Search and Avatar dropdown */}
                    <div className="flex items-start gap-2">
                        <form onSubmit={handleSearch} className="relative flex items-center gap-2">
                            <input
                                type="text"
                                placeholder="Search by email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />

                            {isSearching ? (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    // className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"

                                >
                                    ✕
                                </button>
                            ) :
                                (
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        Search
                                    </button>
                                )}
                        </form>

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
                            {isDropdownOpen && (
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                            )}
                        </div>
                    </div>
                </div>

                {/* User Management Table */}
                <div className="w-full">
                    {/* Desktop Table View */}
                    <div className="hidden md:block rounded-lg shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-muted">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold bg-gray-100">User</th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold bg-gray-100">
                                        Email Verified
                                    </th>
                                    <th className="px-6 py-4 text-center text-sm font-semibold bg-gray-100">
                                        Account Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold bg-gray-100">
                                        Created
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold bg-gray-100">
                                        Updated
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="divide-gray-200 divide-y">
                                {isSearching ? (
                                    searchResults.length > 0 ? (
                                        searchResults.map((u, index) => (
                                            <tr
                                                key={u.id}


                                                className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                                }`}
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                            {u.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="text-sm font-medium text-foreground text-balance">
                                                                {u.name}
                                                            </div>
                                                            <div className="text-sm text-muted-foreground truncate">
                                                                {u.email}
                                                            </div>
                                                            <div className="text-xs text-accent font-medium mt-1">
                                                                {formatRoles(u.roles)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.emailVerified
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                            }`}
                                                        >
                                                            {u.emailVerified ? "Verified" : "Unverified"}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.accountEnabled
                                                                ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                                : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                            }`}
                                                        >
                                                            {u.accountEnabled ? "Enabled" : "Disabled"}
                                                        </span>
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                    {formatDate(u.createdOn)}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                    {formatDate(u.updatedOn)}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                                                User with email not found.
                                            </td>
                                        </tr>
                                    )
                                ) : (
                                    users.map((u, index) => (
                                        <tr
                                            key={u.id}
                                            className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"
                                            }`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                        {u.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-foreground text-balance">
                                                            {u.name}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">
                                                            {u.email}
                                                        </div>
                                                        <div className="text-xs text-accent font-medium mt-1">
                                                            {formatRoles(u.roles)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.emailVerified
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                        }`}
                                                    >
                                                        {u.emailVerified ? "Verified" : "Unverified"}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                    <span
                                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${u.accountEnabled
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                        }`}
                                                    >
                                                        {u.accountEnabled ? "Enabled" : "Disabled"}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                {formatDate(u.createdOn)}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-muted-foreground">
                                                {formatDate(u.updatedOn)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                {/* Pagination Controls */}
                <div className="flex justify-center items-center mt-6 gap-2">
                    <button
                        onClick={goToPrevPage}
                        disabled={currentPage === 0}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === 0
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        Prev
                    </button>

                    {/* Page numbers */}
                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index)}
                            className={`px-3 py-1 rounded-lg ${
                                currentPage === index
                                    ? "bg-indigo-600 text-white"
                                    : "bg-gray-200 hover:bg-gray-300"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages - 1}
                        className={`px-4 py-2 rounded-lg ${
                            currentPage === totalPages - 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "bg-indigo-600 text-white hover:bg-indigo-700"
                        }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Admin_Panel;