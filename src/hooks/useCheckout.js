// hooks/useCheckout.js
import { useState } from 'react';

export const useCheckout = (createSale, user) => {
    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [customerName, setCustomerName] = useState("");

    const handleCheckout = async (cart, discounts, calculateTotal, calculateDiscount, getAppliedDiscountType) => {
        const total = calculateTotal();
        let finalPaymentAmount = parseFloat(paymentAmount) || 0;
        let changeDue = 0;

        if (paymentMethod === 'cash') {
            changeDue = finalPaymentAmount - total;
            if (changeDue < 0) {
                alert("Payment amount is insufficient");
                return false;
            }
        } else {
            finalPaymentAmount = total;
            changeDue = 0;
            setPaymentAmount(total.toFixed(2));
        }

        try {
            const saleData = {
                user_id: user.user_id,
                items: cart.map(item => ({
                    product_id: item.product_id,
                    quantity: item.quantity,
                    price: item.price
                })),
                payment_type: paymentMethod,
                amount_tendered: finalPaymentAmount,
                change_due: changeDue,
                discount_type: getAppliedDiscountType(discounts),
                discount_amount: calculateDiscount(),
                customer_name: customerName.trim() || null
            };

            await createSale(saleData);
            return true;
        } catch (error) {
            console.error("Checkout error:", error);
            alert("Failed to complete sale");
            return false;
        }
    };

    const resetCheckout = () => {
        setPaymentAmount("");
        setCustomerName("");
    };

    return {
        paymentAmount,
        setPaymentAmount,
        paymentMethod,
        setPaymentMethod,
        customerName,
        setCustomerName,
        handleCheckout,
        resetCheckout
    };
};