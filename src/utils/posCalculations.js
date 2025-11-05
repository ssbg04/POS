// utils/posCalculations.js
export const calculateSubtotal = (cart) => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
};

export const calculateDiscount = (subtotal, discounts, pwdDiscountRate, seniorDiscountRate) => {
    if (discounts.pwd) return subtotal * pwdDiscountRate;
    if (discounts.senior) return subtotal * seniorDiscountRate;
    return 0;
};

export const getAppliedDiscountType = (discounts) => {
    if (discounts.pwd) return "PWD";
    if (discounts.senior) return "Senior Citizen";
    return null;
};

export const calculateTax = (subtotal, discount, taxRate, discounts) => {
    if (discounts.pwd || discounts.senior) return 0;
    return (subtotal - discount) * taxRate;
};

export const calculateTotal = (subtotal, discount, tax) => {
    return (subtotal - discount) + tax;
};

export const calculateChange = (total, paymentAmount) => {
    const payment = parseFloat(paymentAmount) || 0;
    return payment - total;
};