import { useState, useRef, useEffect } from "react";
import { useAuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../hooks/useProducts";
import { useSales } from "../hooks/useSales";
import { useSettings } from "../hooks/useSettings";
import { useCategories } from "../hooks/useCategories";
import { useDeviceDetection } from "../hooks/useDeviceDetection";
import { useCart } from "../hooks/useCart";
import { useCheckout } from "../hooks/useCheckout";
import { useNumpad } from "../hooks/useNumpad";
import {
    calculateSubtotal,
    calculateDiscount,
    calculateTax,
    calculateTotal,
    calculateChange,
    getAppliedDiscountType
} from "../utils/posCalculations";
import Numpad from "../components/Numpad";
import POSHeader from "../components/POSHeader";
import ProductsPanel from "../components/ProductsPanel";
import CartCheckoutPanel from "../components/CartCheckoutPanel";

const POS = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();
    const { createSale } = useSales();
    const { settings, loading: settingsLoading } = useSettings();
    const { categories, loading: categoriesLoading } = useCategories();

    // Search & filter
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchTerm, setSearchTerm] = useState("");
    const { products, loading: productsLoading, getProducts } = useProducts(searchTerm, selectedCategory);

    const [discounts, setDiscounts] = useState({ pwd: false, senior: false });
    const [barcodeInput, setBarcodeInput] = useState("");
    const barcodeInputRef = useRef(null);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const { deviceType, isFullscreen, toggleFullscreen } = useDeviceDetection(settings?.fullscreen_mode || "auto");
    const { cart, addToCart, removeFromCart, updateQuantity, clearCart } = useCart();
    const {
        paymentAmount,
        setPaymentAmount,
        paymentMethod,
        setPaymentMethod,
        customerName,
        setCustomerName,
        handleCheckout,
        resetCheckout
    } = useCheckout(createSale, user);

    const {
        showNumpad,
        numpadValue,
        numpadTarget,
        openNumpad,
        handleNumpadInput,
        applyNumpadValue,
        closeNumpad
    } = useNumpad();

    const pwdDiscountRate = settings?.pwd_discount_rate || 0.20;
    const seniorDiscountRate = settings?.senior_discount_rate || 0.20;
    const taxRate = settings?.tax_rate || 0.12;

    // Calculations
    const subtotal = calculateSubtotal(cart);
    const discount = calculateDiscount(subtotal, discounts, pwdDiscountRate, seniorDiscountRate);
    const tax = calculateTax(subtotal, discount, taxRate, discounts);
    const total = calculateTotal(subtotal, discount, tax);
    const change = calculateChange(total, paymentAmount);

    // Handlers
    const toggleDarkMode = () => setIsDarkMode(prev => !prev);
    const handleLogout = () => { logout(); navigate("/login"); };
    const handleDiscountChange = (type) => {
        setDiscounts(prev => ({ pwd: type === 'pwd' ? !prev.pwd : false, senior: type === 'senior' ? !prev.senior : false }));
    };
    const handleSuccessfulCheckout = async () => {
        const success = await handleCheckout(cart, discounts, () => total, () => discount, getAppliedDiscountType);
        if (success) {
            clearCart();
            resetCheckout();
            setDiscounts({ pwd: false, senior: false });
            alert("Sale completed successfully!");
            getProducts();
        }
    };
    const handleBarcodeSubmit = (e) => {
        e.preventDefault();
        if (barcodeInput.trim()) {
            const product = products.find(p => p.barcode === barcodeInput.trim());
            if (product) {
                addToCart(product);
                setBarcodeInput("");
                barcodeInputRef.current?.focus();
            }
        }
    };
    const handleApplyNumpad = () => {
        if (numpadTarget === 'payment') setPaymentAmount(numpadValue);
        applyNumpadValue();
    };

    useEffect(() => {
        if (settings) setIsDarkMode(settings.dark_mode === 'dark');
    }, [settings]);

    if (productsLoading || settingsLoading || categoriesLoading) {
        return (
            <div className={`w-screen h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div className="text-xl">Loading POS...</div>
            </div>
        );
    }

    return (
        <div className={`w-screen h-screen flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-800'}`}>

            {/* Header */}
            <div className="flex-shrink-0">
                <POSHeader
                    user={user}
                    isDarkMode={isDarkMode}
                    isFullscreen={isFullscreen}
                    deviceType={deviceType}
                    pwdDiscountRate={pwdDiscountRate}
                    seniorDiscountRate={seniorDiscountRate}
                    taxRate={taxRate}
                    onToggleFullscreen={toggleFullscreen}
                    onToggleDarkMode={toggleDarkMode}
                    onLogout={handleLogout}
                />
            </div>

            {/* Panels */}
            <div className={`flex-1 flex flex-col sm:flex-row gap-4 overflow-hidden p-4`}>
                {/* Products Panel */}
                <div className="flex-1 overflow-hidden">
                    <ProductsPanel
                        isDarkMode={isDarkMode}
                        deviceType={deviceType}
                        products={products || []}
                        productsLoading={productsLoading}
                        categories={categories || []}
                        searchTerm={searchTerm}
                        selectedCategory={selectedCategory}
                        barcodeInput={barcodeInput}
                        onSearchChange={setSearchTerm}
                        onCategoryChange={setSelectedCategory}
                        onBarcodeChange={setBarcodeInput}
                        onBarcodeSubmit={handleBarcodeSubmit}
                        onAddToCart={addToCart}
                        barcodeInputRef={barcodeInputRef}
                    />
                </div>

                {/* Cart & Checkout Panel */}
                <div
                    className={`flex-shrink-0 sm:w-[360px] w-full h-full overflow-y-auto`}
                    style={{ maxHeight: '100%' }}
                >
                    <CartCheckoutPanel
                        isDarkMode={isDarkMode}
                        cart={cart}
                        customerName={customerName}
                        paymentAmount={paymentAmount}
                        paymentMethod={paymentMethod}
                        discounts={discounts}
                        subtotal={subtotal}
                        discount={discount}
                        tax={tax}
                        total={total}
                        change={change}
                        pwdDiscountRate={pwdDiscountRate}
                        seniorDiscountRate={seniorDiscountRate}
                        taxRate={taxRate}
                        onRemoveFromCart={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onCustomerNameChange={setCustomerName}
                        onPaymentMethodChange={setPaymentMethod}
                        onDiscountChange={handleDiscountChange}
                        onOpenNumpad={() => openNumpad('payment', paymentAmount)}
                        onCheckout={handleSuccessfulCheckout}
                        getAppliedDiscountType={() => getAppliedDiscountType(discounts)}
                    />
                </div>
            </div>

            {/* Numpad Modal */}
            {showNumpad && (
                <Numpad
                    isDarkMode={isDarkMode}
                    numpadValue={numpadValue}
                    onInput={handleNumpadInput}
                    onApply={handleApplyNumpad}
                    onClose={closeNumpad}
                />
            )}
        </div>
    );
};

export default POS;