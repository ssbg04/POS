// components/Sales.jsx
import { useState } from "react";
import { useSales } from "../hooks/useSales";
import { useAuthContext } from "../context/AuthContext";

const Sales = () => {
    const { user } = useAuthContext();
    const { sales, loading, error, pagination, goToPage, voidSale, refundSale } = useSales();
    const [selectedSale, setSelectedSale] = useState(null);
    const [actionModal, setActionModal] = useState({ show: false, type: '', sale: null });

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-PH', {
            style: 'currency',
            currency: 'PHP'
        }).format(amount);
    };

    const handleVoid = async (sale) => {
        try {
            await voidSale(sale.sale_id);
            setActionModal({ show: false, type: '', sale: null });
            goToPage(pagination.currentPage);
        } catch (err) {
            console.error('Failed to void sale:', err);
        }
    };

    const handleRefund = async (sale) => {
        try {
            await refundSale(sale.sale_id);
            setActionModal({ show: false, type: '', sale: null });
            goToPage(pagination.currentPage);
        } catch (err) {
            console.error('Failed to refund sale:', err);
        }
    };

    const openActionModal = (type, sale) => {
        setActionModal({ show: true, type, sale });
    };

    const getStatusBadge = (status) => {
        const statusStyles = {
            completed: 'bg-green-100 text-green-800',
            voided: 'bg-red-100 text-red-800',
            refunded: 'bg-orange-100 text-orange-800'
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusStyles[status] || 'bg-gray-100 text-gray-800'}`}>
                {status?.toUpperCase()}
            </span>
        );
    };

    const getPaymentBadge = (paymentType) => {
        const paymentStyles = {
            gcash: 'bg-green-100 text-green-800',
            card: 'bg-blue-100 text-blue-800',
            cash: 'bg-gray-100 text-gray-800'
        };

        return (
            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${paymentStyles[paymentType] || 'bg-gray-100 text-gray-800'}`}>
                {paymentType?.toUpperCase()}
            </span>
        );
    };

    const renderPagination = () => {
        if (pagination.totalPages <= 1) return null;

        return (
            <div className="flex items-center justify-between border-t border-gray-200 backdrop-blur-md bg-white/60 dark:bg-gray-800/60 px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <button
                        onClick={() => goToPage(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrev}
                        className="relative inline-flex items-center rounded-md border border-gray-300 backdrop-blur-md bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Previous
                    </button>
                    <button
                        onClick={() => goToPage(pagination.currentPage + 1)}
                        disabled={!pagination.hasNext}
                        className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 backdrop-blur-md bg-white/60 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                    </button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                            Showing <span className="font-medium">{(pagination.currentPage - 1) * 10 + 1}</span> to{' '}
                            <span className="font-medium">
                                {Math.min(pagination.currentPage * 10, pagination.totalSales)}
                            </span> of{' '}
                            <span className="font-medium">{pagination.totalSales}</span> results
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <button
                                onClick={() => goToPage(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrev}
                                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-white/80 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Previous</span>
                                ←
                            </button>

                            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                let pageNum;
                                if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                } else if (pagination.currentPage <= 3) {
                                    pageNum = i + 1;
                                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                } else {
                                    pageNum = pagination.currentPage - 2 + i;
                                }

                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => goToPage(pageNum)}
                                        className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${pagination.currentPage === pageNum
                                            ? 'bg-blue-500 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500'
                                            : 'text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 hover:bg-white/80 focus:z-20 focus:outline-offset-0'
                                            }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}

                            <button
                                onClick={() => goToPage(pagination.currentPage + 1)}
                                disabled={!pagination.hasNext}
                                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-white/80 focus:z-20 focus:outline-offset-0 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="sr-only">Next</span>
                                →
                            </button>
                        </nav>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 shadow-lg">
                    Loading sales...
                </div>
            </div>
        </div>
    );

    if (error) return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 shadow-lg text-red-500">
                    Error: {error}
                </div>
            </div>
        </div>
    );

    return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>

            {/* Main content */}
            <div className="relative z-10 flex flex-col h-full">
                {/* Header */}
                <div className="flex-shrink-0 backdrop-blur-md bg-white/30 dark:bg-gray-800/30 shadow-sm border border-white/20 rounded-2xl px-6 py-4 mb-4">
                    <div className="flex justify-between items-center">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Sales & Transactions</h1>
                        <div className="text-sm text-gray-600 dark:text-gray-300">
                            Total: {pagination.totalSales} sales
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-lg border border-white/20 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200/50">
                                <thead className="backdrop-blur-md  text-gray-500 dark:text-neutral-300  bg-white/60 dark:bg-gray-800/60">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Sale ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                            Date & Time
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                            Cashier
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                            Payment
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                                            Total Amount
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium  uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200/50">
                                    {sales.map((sale) => (
                                        <tr key={sale.sale_id} className="hover:bg-white/20 dark:hover:bg-gray-700/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                                                #{sale.sale_id}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {sale.customer_name ? (
                                                    <span className="font-medium text-blue-600 dark:text-blue-400">{sale.customer_name}</span>
                                                ) : (
                                                    <span className="text-gray-400">Walk-in</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {formatDate(sale.sale_date)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {sale.users?.full_name || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {getPaymentBadge(sale.payment_type)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                {getStatusBadge(sale.status)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                                                {formatCurrency(sale.total_amount)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => setSelectedSale(sale)}
                                                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                                                    >
                                                        View
                                                    </button>
                                                    {sale.status === 'completed' && (
                                                        <>
                                                            <button
                                                                onClick={() => openActionModal('void', sale)}
                                                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                Void
                                                            </button>
                                                            <button
                                                                onClick={() => openActionModal('refund', sale)}
                                                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                Refund
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {sales.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                No sales transactions found.
                            </div>
                        )}

                        {/* Pagination */}
                        {renderPagination()}
                    </div>
                </div>
            </div>

            {/* Sale Details Modal */}
            {selectedSale && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                    onClick={() => setSelectedSale(null)}
                >
                    <div
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto border border-white/20 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">Sale Details #{selectedSale.sale_id}</h3>
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Date & Time</p>
                                <p className="font-medium text-gray-800 dark:text-white">{formatDate(selectedSale.sale_date)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cashier</p>
                                <p className="font-medium text-gray-800 dark:text-white">{selectedSale.users?.full_name || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Customer Name</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {selectedSale.customer_name || (
                                        <span className="text-gray-400">Walk-in Customer</span>
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Payment Method</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {getPaymentBadge(selectedSale.payment_type)}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
                                <p className="font-medium text-gray-800 dark:text-white">
                                    {getStatusBadge(selectedSale.status)}
                                </p>
                            </div>
                            {selectedSale.discount_type && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Discount Applied</p>
                                    <p className="font-medium text-green-600 dark:text-green-400">
                                        {selectedSale.discount_type} (-₱{selectedSale.discount_amount?.toFixed(2)})
                                    </p>
                                </div>
                            )}
                            {selectedSale.tax_amount > 0 && (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tax</p>
                                    <p className="font-medium text-gray-800 dark:text-white">
                                        ₱{selectedSale.tax_amount?.toFixed(2)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Financial Summary */}
                        <div className="backdrop-blur-md bg-white/50 dark:bg-gray-700/50 p-4 rounded-lg mb-4 border border-white/20">
                            <h4 className="font-semibold mb-2 text-gray-800 dark:text-white">Financial Summary</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                                    <span className="text-gray-800 dark:text-white">₱{(selectedSale.total_amount + (selectedSale.discount_amount || 0) - (selectedSale.tax_amount || 0)).toFixed(2)}</span>
                                </div>
                                {selectedSale.discount_amount > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400">
                                        <span>Discount:</span>
                                        <span>-₱{selectedSale.discount_amount?.toFixed(2)}</span>
                                    </div>
                                )}
                                {selectedSale.tax_amount > 0 && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                                        <span className="text-gray-800 dark:text-white">₱{selectedSale.tax_amount?.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-semibold border-t border-gray-300 dark:border-gray-600 pt-1 col-span-2">
                                    <span className="text-gray-800 dark:text-white">Total Amount:</span>
                                    <span className="text-gray-800 dark:text-white">₱{selectedSale.total_amount?.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between col-span-2">
                                    <span className="text-gray-600 dark:text-gray-400">Amount Tendered:</span>
                                    <span className="text-gray-800 dark:text-white">₱{selectedSale.amount_tendered?.toFixed(2)}</span>
                                </div>
                                {selectedSale.change_due > 0 && (
                                    <div className="flex justify-between text-green-600 dark:text-green-400 col-span-2">
                                        <span>Change Due:</span>
                                        <span>₱{selectedSale.change_due?.toFixed(2)}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Items Table */}
                        <h4 className="font-semibold text-lg text-gray-800 dark:text-white mb-3">Items Purchased</h4>
                        <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden backdrop-blur-md bg-white/50 dark:bg-gray-700/50">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                                <thead className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-medium  uppercase tracking-wider">Product</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium  uppercase tracking-wider">Qty</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Price</th>
                                        <th className="px-4 py-3 text-left text-sm font-medium uppercase tracking-wider">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                    {selectedSale.sale_items?.map((item, index) => (
                                        <tr key={index} className="hover:bg-white/30 dark:hover:bg-gray-600/30">
                                            <td className="px-4 py-3 text-sm text-gray-800 dark:text-white">{item.products?.name}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{item.quantity}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">{formatCurrency(item.price)}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-800 dark:text-white">{formatCurrency(item.total)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setSelectedSale(null)}
                                className="px-6 py-2 backdrop-blur-md bg-white/30 dark:bg-gray-700/30 text-gray-800 dark:text-white rounded-lg hover:bg-white/50 dark:hover:bg-gray-600/50 border border-white/20 cursor-pointer transition-colors"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Void/Refund Confirmation Modal */}
            {actionModal.show && (
                <div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        backdropFilter: 'blur(8px)',
                        WebkitBackdropFilter: 'blur(8px)'
                    }}
                    onClick={() => setActionModal({ show: false, type: '', sale: null })}
                >
                    <div
                        className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 border border-white/20 transition-all duration-300"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
                            {actionModal.type === 'void' ? 'Confirm Void' : 'Confirm Refund'}
                        </h3>
                        <p className="mb-6 text-gray-600 dark:text-gray-400">
                            Are you sure you want to {actionModal.type} sale #{actionModal.sale.sale_id}?
                            {actionModal.type === 'void' && ' This action cannot be undone.'}
                        </p>
                        <div className="flex gap-4">
                            <button
                                onClick={() => actionModal.type === 'void'
                                    ? handleVoid(actionModal.sale)
                                    : handleRefund(actionModal.sale)
                                }
                                className={`flex-1 px-4 py-2 text-white rounded-lg hover:opacity-90 cursor-pointer transition-colors ${actionModal.type === 'void' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
                                    }`}
                            >
                                Yes, {actionModal.type === 'void' ? 'Void' : 'Refund'}
                            </button>
                            <button
                                onClick={() => setActionModal({ show: false, type: '', sale: null })}
                                className="flex-1 px-4 py-2 backdrop-blur-md bg-white/30 dark:bg-gray-700/30 text-gray-800 dark:text-white rounded-lg hover:bg-white/50 dark:hover:bg-gray-600/50 border border-white/20 cursor-pointer transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Animated gradient pulse */}
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

export default Sales;