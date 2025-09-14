import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const Admin_Panel = () => {
    const { user, logout, isLoading } = useContext(AuthContext);

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
                <div className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl font-bold text-foreground mb-2">Admin Panel</h1>
                        <p className="text-muted-foreground">Manage users and system settings</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">Welcome, {user?.name || "Admin"}</span>
                        <button
                            onClick={logout}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Admin Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* User Management Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">User Management</h2>
                        <p className="text-gray-600 mb-4">View and manage all registered users</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Manage Users
                        </button>
                    </div>

                    {/* URL Analytics Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">Global Analytics</h2>
                        <p className="text-gray-600 mb-4">View system-wide URL statistics</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            View Analytics
                        </button>
                    </div>

                    {/* System Settings Card */}
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <h2 className="text-xl font-semibold mb-4">System Settings</h2>
                        <p className="text-gray-600 mb-4">Configure application settings</p>
                        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                            Settings
                        </button>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Recent Activity</h2>
                    <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                        <p className="text-gray-600">Activity logs will be displayed here...</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin_Panel;
