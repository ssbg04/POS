// components/Numpad.jsx
import React from 'react';

const Numpad = ({ isDarkMode, numpadValue, onInput, onApply, onClose }) => {
    // Numbers array
    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, '.', 0, 'clear'];

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            style={{
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
            }}
            role="dialog"
            aria-label="Number pad"
        >
            <div
                className={`rounded-lg p-4 w-full max-w-xs sm:max-w-sm ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
            >
                {/* Display */}
                <div className="text-center mb-4">
                    <div
                        className={`text-2xl font-mono p-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
                        aria-live="polite"
                    >
                        {numpadValue || '0'}
                    </div>
                </div>

                {/* Main content: numbers + actions */}
                <div className="flex gap-2">
                    {/* Numbers Grid */}
                    <div className="grid grid-cols-3 gap-2 flex-1">
                        {numbers.map((num) => (
                            <button
                                key={num}
                                onClick={() => onInput(num.toString())}
                                className={`p-3 rounded-lg text-lg font-semibold hover:opacity-80 ${isDarkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'}`}
                                aria-label={num === 'clear' ? 'Clear' : `Number ${num}`}
                            >
                                {num === 'clear' ? 'C' : num}
                            </button>
                        ))}
                    </div>

                    {/* Actions Column */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => onInput('backspace')}
                            className="p-3 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600"
                            aria-label="Backspace"
                        >
                            ⌫
                        </button>
                        <button
                            onClick={onApply}
                            className="p-3 bg-green-500 text-white rounded-lg text-lg font-semibold hover:bg-green-600"
                            aria-label="Apply"
                        >
                            OK
                        </button>
                        <button
                            onClick={onClose}
                            className="p-3 bg-gray-500 text-white rounded-lg text-lg font-semibold hover:bg-gray-600"
                            aria-label="Cancel"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Numpad;
