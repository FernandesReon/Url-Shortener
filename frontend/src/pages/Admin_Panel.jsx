import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Admin_Panel = () => {
    const { user, logout, isLoading } = useContext(AuthContext);
    const [userInfo, setUserInfo] = useState({
        id: "",
        name: "User",
        email: "admin@example.com",
        role: "user",
    });

    // Mock users data
    const [users, setUsers] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            role: "admin",
            emailVerified: true,
            createdAt: "2023-01-15T10:30:00Z",
            updatedAt: "2023-05-20T14:45:00Z",
            avatar: "/placeholder.svg"
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane@example.com",
            role: "user",
            emailVerified: false,
            createdAt: "2023-02-10T09:15:00Z",
            updatedAt: "2023-06-12T16:20:00Z",
            avatar: "/placeholder.svg"
        },
        {
            id: 3,
            name: "Robert Johnson",
            email: "robert@example.com",
            role: "user",
            emailVerified: true,
            createdAt: "2023-03-05T11:45:00Z",
            updatedAt: "2023-07-18T09:30:00Z",
            avatar: "/placeholder.svg"
        },
        {
            id: 4,
            name: "Emily Williams",
            email: "emily@example.com",
            role: "moderator",
            emailVerified: true,
            createdAt: "2023-04-12T13:20:00Z",
            updatedAt: "2023-08-22T11:15:00Z",
            avatar: "/placeholder.svg"
        },
        {
            id: 5,
            name: "Michael Brown",
            email: "michael@example.com",
            role: "user",
            emailVerified: false,
            createdAt: "2023-05-30T15:50:00Z",
            updatedAt: "2023-09-05T13:40:00Z",
            avatar: "/placeholder.svg"
        }
    ]);

    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.ceil(users.length / 5); // 5 users per page

    const formatRoles = (roles) => {
        if (!roles) return "user";
        return Array.isArray(roles) ? roles.join(", ") : String(roles);
    };

    // Format date for display
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    // Handle page change
    const onPageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
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

    // Get users for current page
    const usersForCurrentPage = users.slice((currentPage - 1) * 5, currentPage * 5);

    return (
        <div className="h-screen w-screen bg-white flex flex-col">
            <div className="flex-1 px-8 py-8 overflow-auto">
                {/* Header */}
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
                        <p className="text-muted-foreground">Manage users and system settings</p>
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
                                        <p className="text-md font-medium text-gray-900">
                                            {userInfo.name}
                                        </p>
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
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setIsDropdownOpen(false)}
                            />
                        )}
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
                                        <th className="px-6 py-4 text-left text-sm font-semibold bg-gray-100">
                                            <div className="flex items-center gap-2">
                                                User
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-center text-sm font-semibold bg-gray-100">
                                            <div className="flex items-center justify-center gap-2">
                                                Email Verified
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold bg-gray-100">
                                            <div className="flex items-center justify-end gap-2">
                                                Created
                                            </div>
                                        </th>
                                        <th className="px-6 py-4 text-right text-sm font-semibold bg-gray-100">
                                            <div className="flex items-center justify-end gap-2">
                                                Updated
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-gray-200 divide-y">
                                    {usersForCurrentPage.map((user, index) => (
                                        <tr
                                            key={user.id}
                                            className={`hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-muted/10"}`}
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </div>
                                                    <div className="min-w-0 flex-1">
                                                        <div className="text-sm font-medium text-foreground text-balance">{user.name}</div>
                                                        <div className="text-sm text-muted-foreground truncate">{user.email}</div>
                                                        <div className="text-xs text-accent font-medium mt-1">{user.role}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span
                                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.emailVerified
                                                            ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                            : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                    }`}
                                                >
                                                    {user.emailVerified ? "Verified" : "Unverified"}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm text-muted-foreground">{formatDate(user.createdAt)}</td>
                                            <td className="px-6 py-4 text-right text-sm text-muted-foreground">{formatDate(user.updatedAt)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {usersForCurrentPage.map((user) => (
                            <div
                                key={user.id}
                                className="bg-card rounded-lg border border-border p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className="w-16 h-16 rounded-full bg-indigo-600 flex items-center justify-center text-white font-semibold text-xl mb-3">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-sm font-semibold text-foreground text-balance">{user.name}</h3>
                                        <p className="text-sm text-muted-foreground">{user.email}</p>
                                        <span className="inline-block text-xs text-accent font-medium">{user.role}</span>

                                        <div className="flex justify-center mt-3">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                                    user.emailVerified
                                                        ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                                                        : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
                                                }`}
                                            >
                                                {user.emailVerified ? "Verified" : "Unverified"}
                                            </span>
                                        </div>

                                        <div className="mt-4 pt-3 border-t border-border">
                                            <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                                                <div>
                                                    <span className="font-medium block">Created:</span>
                                                    <span className="mt-1 block">{formatDate(user.createdAt)}</span>
                                                </div>
                                                <div>
                                                    <span className="font-medium block">Updated:</span>
                                                    <span className="mt-1 block">{formatDate(user.updatedAt)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    <div className="flex items-center justify-between mt-6 px-2">
                        <div className="text-sm text-muted-foreground">
                            Page {currentPage} of {totalPages}
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Previous
                            </button>

                            {/* Page Numbers */}
                            <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                    let pageNum
                                    if (totalPages <= 5) {
                                        pageNum = i + 1
                                    } else if (currentPage <= 3) {
                                        pageNum = i + 1
                                    } else if (currentPage >= totalPages - 2) {
                                        pageNum = totalPages - 4 + i
                                    } else {
                                        pageNum = currentPage - 2 + i
                                    }

                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => onPageChange(pageNum)}
                                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                                                currentPage === pageNum
                                                    ? "bg-accent text-accent-foreground"
                                                    : "text-foreground bg-background border border-border hover:bg-muted"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    )
                                })}
                            </div>

                            <button
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="px-3 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-md hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Admin_Panel;
