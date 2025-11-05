import { useState } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Products from "../components/Products";
import Sales from "../components/Sales";
import Settings from "../components/Settings";
import Inventory from "../components/Inventory";
import './bg.css'

// Icons only
const ProductsIcon = () => <span>📦</span>;
const ReportsIcon = () => <span>📊</span>;
const SalesIcon = () => <span>💰</span>;
const SettingsIcon = () => <span>⚙️</span>;
const LogoutIcon = () => <span>🚪</span>;
const DashboardIcon = () => <span>📋</span>;
const InventoryIcon = () => <span>📚</span>;

const Home = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const [activeMenu, setActiveMenu] = useState("dashboard");
    const [darkMode, setDarkMode] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const menuItems = [
        { id: "dashboard", icon: DashboardIcon, label: "Dashboard" },
        { id: "products", icon: ProductsIcon, label: "Products" },
        { id: "inventory", icon: InventoryIcon, label: "Inventory" },
        { id: "reports", icon: ReportsIcon, label: "Reports" },
        { id: "sales", icon: SalesIcon, label: "Sales" },
        { id: "settings", icon: SettingsIcon, label: "Settings" },
    ];

    const renderContent = () => {
        switch (activeMenu) {
            case "inventory":
                return <Inventory />;
            case "products":
                return <Products />;
            case "reports":
                return (
                    <div className="h-full flex flex-col">

                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="bg-white/30 dark:bg-gray-800/30 backdrop-blur-md p-6 rounded-lg shadow">
                                <p>Sales reports, analytics charts, and business insights would be displayed here.</p>
                            </div>
                        </div>
                    </div>
                );
            case "sales":
                return <Sales />;
            case "settings":
                return <Settings />;
            default:
                return (
                    <div className="h-full flex flex-col">
                        <div className="flex-1 overflow-y-auto p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-white">
                                <div className="bg-white/4
                                    shadow-white/50 shadow-inner border border-white/20
                                    backdrop-blur-xs p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Today's Sales</h3>
                                    <p className="text-3xl font-bold text-green-600">₱2,847</p>
                                </div>
                                <div className="bg-white/4
                                    shadow-white/50 shadow-inner border border-white/20
                                    backdrop-blur-xs p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Total Orders</h3>
                                    <p className="text-3xl font-bold text-blue-600">156</p>
                                </div>
                                <div className="bg-white/4
                                    shadow-white/50 shadow-inner border border-white/20
                                    backdrop-blur-xs p-6 rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Inventory Items</h3>
                                    <p className="text-3xl font-bold text-purple-600">1,247</p>
                                </div>
                            </div>
                        </div>
                    </div>
                );
        }
    };

    const getActiveLabel = () => {
        const activeItem = menuItems.find(item => item.id === activeMenu);
        return activeItem ? activeItem.label : "Dashboard";
    };

    return (
        <div className={`h-screen flex overflow-hidden relative ${darkMode ? 'dark' : ''}`}>

            {/* Background Gradient */}
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>

            {/* Glossy overlays */}
            <div className="absolute inset-0 opacity-10 bg-white/20 dark:bg-black/20 blur-3xl scale-125"></div>
            <div className="absolute inset-0 opacity-10 bg-white/10 dark:bg-black/10 blur-2xl scale-110"></div>

            {/* Sidebar */}
            <div className="relative z-10 w-20 bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg shadow-lg flex flex-col flex-shrink-0">
                <div className="p-4 border-b dark:border-gray-700 flex flex-col items-center">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">POS</div>
                    <p className="text-xs text-gray-700 dark:text-gray-300 mt-1 text-center">Hi, {user?.username?.split(' ')[0]}</p>
                </div>
                <nav className="flex-1 overflow-y-auto py-4">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveMenu(item.id)}
                            className={`w-full flex flex-col items-center py-3 space-y-1 transition-colors ${activeMenu === item.id
                                ? "bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 border-r-2 border-blue-600"
                                : "text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/30"
                                }`}
                            title={item.label}
                        >
                            <item.icon />
                            <span className="text-xs mt-1">{item.label}</span>
                        </button>
                    ))}
                </nav>
                <div className="p-4 border-t dark:border-gray-700 flex-shrink-0">
                    <button
                        onClick={handleLogout}
                        className="w-full flex flex-col items-center py-2 text-gray-700 dark:text-gray-300 hover:bg-white/10 dark:hover:bg-gray-700/30 rounded"
                        title="Logout"
                    >
                        <LogoutIcon />
                        <span className="text-xs mt-1">Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 relative z-10">
                <header className="bg-white/20 dark:bg-gray-900/40 backdrop-blur-lg shadow-sm border-b dark:border-gray-700 flex-shrink-0 z-10">
                    <div className="flex justify-between items-center px-6 py-4">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">{getActiveLabel()}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-700 dark:text-gray-300 hidden sm:block">{user?.role}</span>
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {user?.username?.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                <main className="flex-1 overflow-hidden">
                    {renderContent()}
                </main>
            </div>

            {/* Gradient pulse animation */}
            <style>{`
    @keyframes gradientDark {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-gradientDark {
    background-size: 400% 400%;
    animation: gradientDark 10s ease infinite;
}
  `}</style>
        </div>
    );
};

export default Home;
