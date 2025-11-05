// components/Inventory.jsx
import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useAuthContext } from "../context/AuthContext";
import InventoryModal from "./InventoryModal";

const Inventory = () => {
    const { user } = useAuthContext();
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [inventoryModalOpen, setInventoryModalOpen] = useState(false);
    const [inventoryAction, setInventoryAction] = useState(null);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");

    const { categories, loading: categoriesLoading } = useCategories();
    const { products, loading: productsLoading } = useProducts(search, selectedCategory);
    const { addLog } = useInventory();

    const openInventoryModal = (product, action) => {
        setSelectedProduct(product);
        setInventoryAction(action);
        setInventoryModalOpen(true);
    };

    const closeInventoryModal = () => {
        setSelectedProduct(null);
        setInventoryAction(null);
        setInventoryModalOpen(false);
    };

    const handleConfirmAction = async (quantity, remarks) => {
        try {
            await addLog({
                product_id: selectedProduct.product_id,
                action: inventoryAction,
                quantity,
                remarks,
            });
            closeInventoryModal();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">

            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>


            {/* Main content */}
            <div className="relative z-10 flex flex-col h-full space-y-4 text-white">

                {/* Filters */}
                <div className="flex gap-2 mb-4 flex-wrap backdrop-blur-sm bg-white/10 rounded-2xl p-4 shadow-white/40 shadow-inner">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 rounded-lg p-2 border border-white/20 bg-black/20  focus:outline-none focus:ring-1 focus:ring-white/60 min-w-[200px]"
                    />
                    <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="min-w-[180px] rounded-lg p-2 border bg-black/20 border-white/20 focus:outline-none focus:ring-2 focus:ring-white/40"
                    >
                        <option value="all"
                            className="bg-black/30"
                        >All Categories</option>
                        {categoriesLoading ? (
                            <option
                                className="bg-black/20">Loading...</option>
                        ) : (
                            categories.filter(cat => cat !== "all").map(cat => (
                                <option
                                    className="bg-black/20"
                                    key={cat} value={cat}>{cat}</option>
                            ))
                        )}
                    </select>
                </div>

                {/* Products Table */}
                <div className="flex-1 overflow-auto backdrop-blur-md mb-[5%] sm:mb-[8%] bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-lg border border-white/20">
                    {productsLoading ? (
                        <div className="flex items-center justify-center h-full p-10">Loading products...</div>
                    ) : products.length === 0 ? (
                        <div className="flex items-center justify-center h-full p-10">No products found.</div>
                    ) : (
                        <div className="overflow-auto h-full">
                            <table className="w-full table-auto border-collapse text-left">
                                <thead className="sticky top-0 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 z-10">
                                    <tr>
                                        <th className="p-3 border-b font-semibold">Name</th>
                                        <th className="p-3 border-b font-semibold">Category</th>
                                        <th className="p-3 border-b font-semibold">Price</th>
                                        <th className="p-3 border-b font-semibold">Stock</th>
                                        <th className="p-3 border-b font-semibold">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((product) => (
                                        <tr key={product.product_id} className="hover:bg-white/20 dark:hover:bg-gray-700 border-b transition-colors">
                                            <td className="p-3">{product.name}</td>
                                            <td className="p-3">{product.category || "Uncategorized"}</td>
                                            <td className="p-3">₱{parseFloat(product.price).toFixed(2)}</td>
                                            <td className="p-3">{product.stock}</td>
                                            <td className="p-3 flex gap-1 flex-wrap">
                                                <button
                                                    onClick={() => openInventoryModal(product, "add")}
                                                    className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Add
                                                </button>
                                                <button
                                                    onClick={() => openInventoryModal(product, "remove")}
                                                    className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Remove
                                                </button>
                                                <button
                                                    onClick={() => openInventoryModal(product, "adjust")}
                                                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Adjust
                                                </button>
                                                <button
                                                    onClick={() => openInventoryModal(product, "sale")}
                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Sale
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

            </div>

            {/* Inventory Modal */}
            {inventoryModalOpen && selectedProduct && (
                <InventoryModal
                    product={selectedProduct}
                    action={inventoryAction}
                    onClose={closeInventoryModal}
                    user={user}
                    onInventoryUpdated={() => handleConfirmAction(0, "")}
                />
            )}

            {/* Animated gradient pulse */}
            <style>{`
                .animate-gradientPulse {
                    background-size: 400% 400%;
                    animation: gradientPulse 15s ease infinite, pulseOpacity 7s ease-in-out infinite alternate;
                }
                @keyframes gradientPulse {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                @keyframes pulseOpacity {
                    0% { opacity: 0.8; }
                    50% { opacity: 1; }
                    100% { opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default Inventory;
