// pages/Products.jsx
import { useState } from "react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import '../pages/bg.css'

const Products = () => {
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { categories, loading: categoriesLoading } = useCategories();
    const { products, loading: productsLoading, error } = useProducts(search, selectedCategory);

    return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">

            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col h-full space-y-4 text-white">

                {/* Filters */}
                <div className="flex gap-2 mb-4 flex-wrap backdrop-blur-md bg-white/10 rounded-2xl p-4 shadow-white/40 shadow-inner">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg p-2 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/40 bg-black/20 min-w-[200px]"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="min-w-[180px] rounded-lg p-2 border border-white/20 focus:outline-none focus:ring-1 focus:ring-white/20 bg-black/20"
                    >
                        <option
                            value="all"
                            className="bg-black/50 "
                        >All Categories</option>
                        {categoriesLoading ? (
                            <option

                            >Loading...</option>
                        ) : (
                            categories.filter(cat => cat !== "all").map(cat => (
                                <option
                                    className="bg-black/50 rounded-b-lg"
                                    key={cat} value={cat}>{cat}</option>
                            ))
                        )}
                    </select>
                </div>

                {/* Products Table */}
                <div className="flex-1 overflow-auto backdrop-blur-sm mb-[5%] sm:mb-[8%] bg-white/2.5 rounded-2xl shadow-lg border border-white/20">
                    {productsLoading ? (
                        <div className="flex items-center justify-center h-full p-10">Loading products...</div>
                    ) : error ? (
                        <div className="flex items-center justify-center h-full p-10">
                            <p className="text-red-500">Error: {error}</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="flex items-center justify-center h-full p-10">No products found.</div>
                    ) : (
                        <div className="overflow-auto h-full">
                            <table className="w-full table-auto border-collapse text-left">
                                <thead className="sticky top-0 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 z-10">
                                    <tr>
                                        <th className="p-3 border-b font-semibold">Name</th>
                                        <th className="p-3 border-b font-semibold">Barcode</th>
                                        <th className="p-3 border-b font-semibold">Category</th>
                                        <th className="p-3 border-b font-semibold">Price</th>
                                        <th className="p-3 border-b font-semibold">Stock</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map(product => (
                                        <tr key={product.product_id} className="hover:bg-white/20 dark:hover:bg-gray-700 border-b transition-colors">
                                            <td className="p-3">{product.name}</td>
                                            <td className="p-3">{product.barcode || '-'}</td>
                                            <td className="p-3">{product.category || product.categories?.name || 'Uncategorized'}</td>
                                            <td className="p-3">₱{parseFloat(product.price).toFixed(2)}</td>
                                            <td className="p-3">{product.stock}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Products;
