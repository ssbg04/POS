// components/InventoryModal.jsx
import { useState } from "react";
import { useInventory } from "../hooks/useInventory";
import { useAuthContext } from "../context/AuthContext";


const InventoryModal = ({ product, action, onClose, onInventoryUpdated, isDarkMode }) => {
    const [quantity, setQuantity] = useState(1);
    const [remarks, setRemarks] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const { addLog } = useInventory();
    const { user } = useAuthContext();
    console.log("Current user:", user);

    const handleSubmit = async (e) => {
        e?.preventDefault();
        if (submitting) return;

        if (!user || (user.user_id === undefined && user.id === undefined)) {
            alert("User not logged in");
            return;
        }
        if (!quantity || Number(quantity) < 1) {
            alert("Please enter a valid quantity (>= 1)");
            return;
        }

        setSubmitting(true);

        try {
            await addLog({
                product_id: product.product_id,
                user_id: user.user_id,
                action,
                quantity: Number(quantity),
                remarks,
            });

            // let parent refresh product list or logs
            if (typeof onInventoryUpdated === "function") {
                await onInventoryUpdated(); // allow parent to wait (if returns promise)
            }

            onClose();

        } catch (err) {
            console.error("Inventory update failed:", err);
            alert("Failed to update inventory: " + (err.response?.data?.error || err.message));
        } finally {
            setSubmitting(false);
        }
    };
    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
                backgroundColor: "rgba(0,0,0,0.3)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)"
            }}

        >
            <div
                className={`w-full max-w-sm p-6 rounded-xl shadow-lg`}
                style={{
                    background: isDarkMode
                        ? "rgba(30,30,30,0.4)"
                        : "rgba(255,255,255,0.15)",
                    border: "1px solid rgba(255,255,255,0.2)",
                    backdropFilter: "blur(15px)",
                    WebkitBackdropFilter: "blur(15px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
                    color: isDarkMode ? "#f1f1f1" : "#000"
                }}


            >

                {user ? (
                    <p>Logged in as: {user.username}</p>
                ) : (
                    <p className="text-red-500">⚠️ Not logged in</p>
                )}
                <h2 className="text-xl font-bold mb-4">
                    {action.charAt(0).toUpperCase() + action.slice(1)} Inventory
                </h2>
                <p className="mb-2 font-medium">Product: {product.name}</p>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value))}
                    min={1}
                    className="w-full mb-2 p-2 rounded border bg-white/20 text-black dark:bg-gray-700 dark:text-white placeholder-gray-400"
                    placeholder="Quantity"
                />
                <textarea
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Remarks (optional)"
                    className="w-full mb-4 p-2 rounded border bg-white/20 text-black dark:bg-gray-700 dark:text-white placeholder-gray-400"
                />
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default InventoryModal;
