// components/POSHeader.jsx
import { FaSun, FaMoon, FaExpand, FaCompress, FaUser, FaSignOutAlt, FaPercent, FaInfoCircle } from "react-icons/fa";

const POSHeader = ({
    user,
    isDarkMode,
    isFullscreen,
    deviceType,
    pwdDiscountRate,
    seniorDiscountRate,
    taxRate,
    onToggleFullscreen,
    onToggleDarkMode,
    onLogout
}) => {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-4 bg-white dark:bg-gray-800 shadow sticky top-0 z-50`}>
            {/* Left Section - Title and Info */}
            <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Point of Sale</h1>
                    <div className="flex items-center gap-2 text-sm">
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-900 text-blue-200' : 'bg-blue-100 text-blue-800'
                            }`}>
                            {deviceType} Mode
                        </div>
                        {isFullscreen && (
                            <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-100 text-green-800'
                                }`}>
                                Fullscreen
                            </div>
                        )}
                    </div>
                </div>

                {/* Rates Information */}
                <div className={`flex flex-wrap items-center gap-4 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    <div className="flex items-center gap-1">
                        <FaPercent className="text-xs" />
                        <span>PWD: {(pwdDiscountRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaPercent className="text-xs" />
                        <span>Senior: {(seniorDiscountRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaPercent className="text-xs" />
                        <span>Tax: {(taxRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <FaInfoCircle className="text-xs" />
                        <span>Discounts don't stack</span>
                    </div>
                </div>
            </div>

            {/* Right Section - Controls and User Info */}
            <div className="flex items-center gap-2 sm:gap-3">
                {/* Fullscreen Toggle */}
                <button
                    onClick={onToggleFullscreen}
                    className={`p-2 rounded-lg transition-all duration-200 ${isFullscreen
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                    title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
                >
                    {isFullscreen ? <FaCompress size={16} /> : <FaExpand size={16} />}
                </button>

                {/* Dark Mode Toggle */}
                <button
                    onClick={onToggleDarkMode}
                    className={`p-2 rounded-lg transition-all duration-200 ${isDarkMode
                        ? 'bg-yellow-400 hover:bg-yellow-500 text-gray-900'
                        : 'bg-gray-700 hover:bg-gray-600 text-white'
                        }`}
                    title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {isDarkMode ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>

                {/* User Info */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                    <FaUser className="text-gray-500" size={14} />
                    <span className="text-sm font-medium">{user?.full_name}</span>
                </div>

                {/* Logout Button */}
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors duration-200 text-sm"
                    title="Logout"
                >
                    <FaSignOutAlt size={14} />
                    <span className="hidden sm:inline">Logout</span>
                </button>
            </div>
        </div>
    );
};

export default POSHeader;