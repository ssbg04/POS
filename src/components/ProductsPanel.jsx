// components/ProductsPanel.jsx
import { FaSearch, FaBarcode, FaTags } from "react-icons/fa";

const ProductsPanel = ({
    isDarkMode,
    deviceType,
    products,
    productsLoading,
    categories,
    searchTerm,
    selectedCategory,
    onSearchChange,
    onCategoryChange,
    onAddToCart,
}) => {
    const bgClass = isDarkMode ? "bg-gray-800" : "bg-white";
    const borderClass = isDarkMode ? "border-gray-600" : "border-gray-300";
    const textClass = isDarkMode ? "text-white" : "text-gray-900";

    return (
        <div
            className={`rounded-lg shadow p-3 sm:p-4 flex flex-col h-full ${bgClass}`}
        >
            {/* Header */}
            <h2 className={`text-lg font-semibold mb-3 flex items-center gap-2 ${textClass}`}>
                <FaTags className="text-blue-500" /> Products
            </h2>

            {/* Search & Category */}
            <div className="flex flex-col sm:flex-row gap-2 mb-3">
                {/* Search */}
                <div className="relative flex-1">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search by product name or barcode..."
                        className={`w-full pl-10 pr-4 py-2 sm:py-3 border rounded text-sm ${bgClass} ${borderClass} ${textClass}`}
                    />
                </div>

                {/* Category Filter */}
                <div className="relative min-w-[140px]">
                    <FaTags className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => onCategoryChange(e.target.value)}
                        className={`w-full pl-10 pr-8 py-2 sm:py-3 border rounded text-sm appearance-none ${bgClass} ${borderClass} ${textClass}`}
                    >
                        <option value="all">All Categories</option>
                        {categories.filter((cat) => cat !== "all").map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Products Count */}
            <div className={`text-xs mb-2 opacity-75 flex items-center gap-1 ${textClass}`}>
                <FaSearch className="text-xs" />
                {productsLoading ? "Searching..." : `Found ${products.length} products`}
            </div>

            {/* Products Grid */}
            <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto">
                    <div
                        className={`grid gap-2 ${deviceType === "mobile"
                            ? "grid-cols-2"
                            : deviceType === "tablet"
                                ? "grid-cols-3"
                                : "grid-cols-4"
                            }`}
                    >
                        {productsLoading && products.length === 0
                            ? Array.from({ length: deviceType === "mobile" ? 4 : 6 }).map(
                                (_, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 sm:p-3 rounded-lg border animate-pulse ${bgClass} ${borderClass}`}
                                    >
                                        <div
                                            className={`h-3 sm:h-4 rounded mb-1 sm:mb-2 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                                                }`}
                                        ></div>
                                        <div
                                            className={`h-2 sm:h-3 rounded w-3/4 ${isDarkMode ? "bg-gray-600" : "bg-gray-300"
                                                }`}
                                        ></div>
                                    </div>
                                )
                            )
                            : products.length === 0
                                ? (
                                    <div
                                        className={`col-span-2 sm:col-span-3 text-center py-8 ${isDarkMode ? "text-gray-400" : "text-gray-500"
                                            }`}
                                    >
                                        <FaSearch className="mx-auto text-2xl mb-2 opacity-50" />
                                        <div>No products found</div>
                                    </div>
                                )
                                : products.map((product) => (
                                    <button
                                        key={product.product_id}
                                        onClick={() => onAddToCart(product)}
                                        disabled={product.stock <= 0}
                                        className={`p-2 sm:p-3 rounded-lg text-left border transition-all duration-200 min-h-[70px] sm:min-h-[80px] flex flex-col justify-between focus:outline-none focus:ring-2 focus:ring-blue-400 ${product.stock <= 0
                                            ? isDarkMode
                                                ? "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                                                : "bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed"
                                            : isDarkMode
                                                ? "bg-blue-900 border-blue-700 hover:bg-blue-800 active:bg-blue-700"
                                                : "bg-blue-50 border-blue-200 hover:bg-blue-100 active:bg-blue-200"
                                            }`}
                                    >
                                        <div className="font-semibold text-xs sm:text-sm truncate mb-1">
                                            {product.name}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="text-xs opacity-75 flex items-center justify-between">
                                                <span>₱{product.price.toFixed(2)}</span>
                                                <span
                                                    className={`text-xs px-1 rounded ${product.stock <= 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                                        }`}
                                                >
                                                    {product.stock}
                                                </span>
                                            </div>
                                            {product.barcode && (
                                                <div className="text-xs opacity-60 truncate flex items-center gap-1">
                                                    <FaBarcode className="text-xs" />
                                                    {product.barcode}
                                                </div>
                                            )}
                                        </div>
                                    </button>
                                ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPanel;
