// hooks/useNumpad.js
import { useState } from 'react';

export const useNumpad = () => {
    const [showNumpad, setShowNumpad] = useState(false);
    const [numpadValue, setNumpadValue] = useState("");
    const [numpadTarget, setNumpadTarget] = useState(null);

    const openNumpad = (target, currentValue = "") => {
        setNumpadTarget(target);
        setNumpadValue(currentValue.toString());
        setShowNumpad(true);
    };

    const closeNumpad = () => {
        setShowNumpad(false);
        setNumpadValue("");
        setNumpadTarget(null);
    };

    const handleNumpadInput = (value) => {
        setNumpadValue(prev => {
            if (value === 'clear') return '';
            if (value === 'backspace') return prev.slice(0, -1);
            if (value === '.') return prev.includes('.') ? prev : prev + '.';
            return prev + value;
        });
    };

    const applyNumpadValue = () => {
        closeNumpad();
    };

    return {
        showNumpad,
        numpadValue,
        numpadTarget,
        openNumpad,
        handleNumpadInput,
        applyNumpadValue,
        closeNumpad
    };
};