const CartCheckoutPanel = ({
    isDarkMode,
    cart,
    customerName,
    paymentAmount,
    paymentMethod,
    discounts,
    subtotal,
    discount,
    tax,
    total,
    change,
    pwdDiscountRate,
    seniorDiscountRate,
    taxRate,
    onRemoveFromCart,
    onUpdateQuantity,
    onCustomerNameChange,
    onPaymentMethodChange,
    onDiscountChange,
    onOpenNumpad,
    onCheckout,
    getAppliedDiscountType
}) => {
    return (
        <div className={`flex flex-col h-full rounded-lg shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>

            {/* Header */}
            <div className="p-3 border-b font-semibold text-lg">
                Cart & Checkout ({cart.length})
            </div>

            {/* Cart Items */}
            <div className="flex-1 min-h-50 overflow-y-auto p-3 space-y-2">
                {cart.length === 0 ? (
                    <div className={`text-center py-8 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Cart is empty
                    </div>
                ) : (
                    cart.map(item => (
                        <div key={item.product_id} className={`p-2 rounded-lg border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex justify-between items-center mb-1">
                                <div className="font-semibold text-sm truncate">{item.name}</div>
                                <button
                                    onClick={() => onRemoveFromCart(item.product_id)}
                                    className="w-6 h-6 text-white bg-red-500 rounded hover:bg-red-600"
                                >
                                    ×
                                </button>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span>₱{(item.price * item.quantity).toFixed(2)}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onUpdateQuantity(item.product_id, item.quantity - 1)}
                                        className={`w-6 h-6 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                                    >-</button>
                                    <span className="w-6 text-center">{item.quantity}</span>
                                    <button
                                        onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                                        className={`w-6 h-6 rounded ${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`}
                                    >+</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Checkout Section */}
            <div className={`p-3 border-t ${isDarkMode ? 'bg-gray-800' : 'bg-white'} space-y-3`}>

                {/* Customer Name */}
                <input
                    type="text"
                    value={customerName}
                    onChange={(e) => onCustomerNameChange(e.target.value)}
                    placeholder="Customer Name (optional)"
                    className={`w-full p-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}
                />

                {/* Discounts */}
                <div className="flex gap-2">
                    {[
                        { type: 'pwd', label: 'PWD', rate: pwdDiscountRate },
                        { type: 'senior', label: 'Senior', rate: seniorDiscountRate }
                    ].map(d => (
                        <label key={d.type} className={`flex-1 flex items-center gap-2 p-2 border rounded cursor-pointer ${discounts[d.type] ? 'bg-green-500 text-white' : isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100'}`}>
                            <input type="checkbox" checked={discounts[d.type]} onChange={() => onDiscountChange(d.type)} />
                            {d.label} ({(d.rate * 100).toFixed(0)}%)
                        </label>
                    ))}
                </div>

                {/* Totals */}
                <div className="space-y-1 text-sm">
                    <div className="flex justify-between"><span>Subtotal:</span><span>₱{subtotal.toFixed(2)}</span></div>
                    {discount > 0 && <div className="flex justify-between text-green-600"><span>{getAppliedDiscountType()} Discount:</span><span>-₱{discount.toFixed(2)}</span></div>}
                    {tax > 0 && <div className="flex justify-between"><span>Tax ({(taxRate * 100).toFixed(0)}%):</span><span>₱{tax.toFixed(2)}</span></div>}
                    <div className="flex justify-between font-semibold border-t pt-2 text-lg"><span>Total:</span><span>₱{total.toFixed(2)}</span></div>
                </div>

                {/* Payment */}
                <select value={paymentMethod} onChange={(e) => onPaymentMethodChange(e.target.value)} className={`w-full p-2 border rounded text-sm ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'}`}>
                    <option value="cash">Cash</option>
                    <option value="gcash">GCash</option>
                    <option value="card">Card</option>
                </select>

                <button
                    onClick={paymentMethod === 'cash' ? onOpenNumpad : undefined}
                    className={`w-full p-3 border rounded text-left ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} ${paymentMethod !== 'cash' ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    {paymentMethod === 'cash'
                        ? paymentAmount ? `₱${parseFloat(paymentAmount).toFixed(2)}` : 'Tap to enter amount'
                        : `₱${total.toFixed(2)}`}
                </button>

                {paymentAmount !== undefined && <div className="text-center text-green-600 font-semibold">Change: ₱{change.toFixed(2)}</div>}

                <button
                    onClick={onCheckout}
                    disabled={cart.length === 0 || (paymentMethod === 'cash' && (!paymentAmount || change < 0))}
                    className="w-full bg-green-500 text-white py-3 rounded hover:bg-green-600 disabled:bg-gray-400 select-none disabled:cursor-not-allowed font-semibold text-lg"
                >
                    COMPLETE SALE
                </button>
            </div>
        </div>
    )
}

export default CartCheckoutPanel;
