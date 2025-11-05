// components/Settings.jsx
import { useState, useEffect } from "react";
import { useSettings } from "../hooks/useSettings";

const Settings = () => {
    const { settings, loading, error, updateSettings } = useSettings();
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState("");
    const [logoPreview, setLogoPreview] = useState("");

    useEffect(() => {
        if (settings) {
            const settingData = Array.isArray(settings) ? settings[0] : settings;
            setFormData({
                store_name: settingData.store_name || '',
                address: settingData.address || '',
                contact: settingData.contact || '',
                tax_rate: settingData.tax_rate || 0.12,
                pwd_discount_rate: settingData.pwd_discount_rate || 0.20,
                senior_discount_rate: settingData.senior_discount_rate || 0.20,
                theme_mode: settingData.theme_mode || 'system',
                fullscreen_mode: settingData.fullscreen_mode || 'auto',
                store_logo_url: settingData.store_logo_url || '',
                business_hours: settingData.business_hours || '',
                receipt_footer: settingData.receipt_footer || ''
            });

            // Set logo preview if logo exists
            if (settingData.store_logo_url) {
                setLogoPreview(settingData.store_logo_url);
            }

            applyThemeSettings(settingData.theme_mode || 'system');
        }
    }, [settings]);

    const handleInputChange = (e) => {
        const { name, value, type, files } = e.target;

        if (type === 'file' && files && files[0]) {
            const file = files[0];
            // Handle file upload - in a real app, you'd upload to a server
            const reader = new FileReader();
            reader.onload = (e) => {
                const logoUrl = e.target.result;
                setLogoPreview(logoUrl);
                setFormData(prev => ({ ...prev, [name]: logoUrl }));
            };
            reader.readAsDataURL(file);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (name === 'theme_mode') {
            applyThemeSettings(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveMessage("");

        try {
            await updateSettings(formData);
            setSaveMessage("Settings saved successfully!");
            setTimeout(() => setSaveMessage(""), 3000);
        } catch (err) {
            setSaveMessage("Failed to save settings: " + err.message);
        } finally {
            setSaving(false);
        }
    };

    const applyThemeSettings = (themeMode) => {
        const html = document.documentElement;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Remove all theme classes first
        html.classList.remove('light', 'dark');

        // Apply the selected theme
        switch (themeMode) {
            case 'light':
                html.classList.add('light');
                break;
            case 'dark':
                html.classList.add('dark');
                break;
            case 'system':
            default:
                // Use system preference
                if (systemPrefersDark) {
                    html.classList.add('dark');
                } else {
                    html.classList.add('light');
                }
                break;
        }

        // Store the theme preference in localStorage for persistence
        localStorage.setItem('theme-preference', themeMode);
    };

    // Initialize theme on component mount
    useEffect(() => {
        // Check for saved theme preference first, then settings
        const savedTheme = localStorage.getItem('theme-preference');
        if (savedTheme) {
            setFormData(prev => ({ ...prev, theme_mode: savedTheme }));
            applyThemeSettings(savedTheme);
        } else if (settings?.theme_mode) {
            applyThemeSettings(settings.theme_mode);
        } else {
            // Default to system preference
            applyThemeSettings('system');
        }
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => console.log(err));
        } else {
            document.exitFullscreen();
        }
    };

    const isTablet = () => window.innerWidth <= 1024 && window.innerWidth >= 768;

    const removeLogo = () => {
        setLogoPreview("");
        setFormData(prev => ({ ...prev, store_logo_url: '' }));
    };

    // Predefined business hours options
    const businessHoursOptions = [
        { value: '24/7', label: '24/7 Open' },
        { value: '9AM-6PM', label: '9:00 AM - 6:00 PM' },
        { value: '8AM-8PM', label: '8:00 AM - 8:00 PM' },
        { value: '10AM-10PM', label: '10:00 AM - 10:00 PM' },
        { value: 'custom', label: 'Custom Hours' }
    ];

    if (loading) return (
        <div className="relative flex flex-col h-screen p-6 overflow-hidden">
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>
            <div className="relative z-10 flex items-center justify-center h-full">
                <div className="backdrop-blur-md bg-white/30 dark:bg-gray-800/30 rounded-2xl p-8 shadow-lg">
                    Loading settings...
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
            <div className="relative z-10 flex-1 overflow-auto">
                <div className="p-6 max-w-4xl mx-auto">
                    <div className="backdrop-blur-lg bg-white/30 dark:bg-gray-800/30 rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6">
                        {saveMessage && (
                            <div className={`p-4 mb-6 rounded-lg backdrop-blur-md ${saveMessage.includes('Failed')
                                ? 'bg-red-100/80 text-red-700 dark:bg-red-900/80 dark:text-red-200'
                                : 'bg-green-100/80 text-green-700 dark:bg-green-900/80 dark:text-green-200'
                                }`}>
                                {saveMessage}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Store Information */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Store Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Store Name</label>
                                        <input
                                            type="text"
                                            name="store_name"
                                            value={formData.store_name || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter store name"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Contact Number</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter contact number"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Address</label>
                                        <textarea
                                            name="address"
                                            value={formData.address || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                            placeholder="Enter store address"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Store Logo */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Store Logo</h3>
                                <div className="flex flex-col md:flex-row gap-6 items-start">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Upload Store Logo
                                        </label>
                                        <input
                                            type="file"
                                            name="store_logo_url"
                                            onChange={handleInputChange}
                                            accept="image/*"
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Recommended: Square image, PNG or JPG, max 2MB
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-center">
                                        <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center bg-white/50 dark:bg-gray-700/50">
                                            {logoPreview ? (
                                                <img
                                                    src={logoPreview}
                                                    alt="Store Logo Preview"
                                                    className="w-full h-full object-contain rounded-lg"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-sm">No Logo</span>
                                            )}
                                        </div>
                                        {logoPreview && (
                                            <button
                                                type="button"
                                                onClick={removeLogo}
                                                className="mt-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-lg transition-colors duration-200"
                                            >
                                                Remove Logo
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Business Hours */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Business Hours</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Operating Hours
                                        </label>
                                        <select
                                            name="business_hours"
                                            value={formData.business_hours || ''}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        >
                                            <option value="">Select business hours</option>
                                            {businessHoursOptions.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    {formData.business_hours === 'custom' && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Custom Business Hours
                                            </label>
                                            <input
                                                type="text"
                                                name="business_hours_custom"
                                                value={formData.business_hours_custom || ''}
                                                onChange={handleInputChange}
                                                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                                placeholder="e.g., Mon-Fri 9AM-6PM, Sat 10AM-4PM"
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Receipt Settings */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Receipt Settings</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Receipt Footer Message
                                        </label>
                                        <textarea
                                            name="receipt_footer"
                                            value={formData.receipt_footer || ''}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                            placeholder="Thank you for your purchase! Visit us again..."
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            This message will appear at the bottom of all receipts
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Tax & Discount Rates */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Tax & Discount Rates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tax Rate (%)</label>
                                        <input
                                            type="number"
                                            name="tax_rate"
                                            value={formData.tax_rate ? (formData.tax_rate * 100) : ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, tax_rate: (parseFloat(e.target.value) || 0) / 100 }))}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Current: {(formData.tax_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">PWD Discount (%)</label>
                                        <input
                                            type="number"
                                            name="pwd_discount_rate"
                                            value={formData.pwd_discount_rate ? (formData.pwd_discount_rate * 100) : ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, pwd_discount_rate: (parseFloat(e.target.value) || 0) / 100 }))}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Current: {(formData.pwd_discount_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Senior Discount (%)</label>
                                        <input
                                            type="number"
                                            name="senior_discount_rate"
                                            value={formData.senior_discount_rate ? (formData.senior_discount_rate * 100) : ''}
                                            onChange={(e) => setFormData(prev => ({ ...prev, senior_discount_rate: (parseFloat(e.target.value) || 0) / 100 }))}
                                            step="0.1"
                                            min="0"
                                            max="100"
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Current: {(formData.senior_discount_rate * 100).toFixed(1)}%
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Display & Interface */}
                            <div className="backdrop-blur-md bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 border border-white/20 dark:border-gray-700/20">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">Display & Interface</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Theme Mode</label>
                                        <select
                                            name="theme_mode"
                                            value={formData.theme_mode || 'system'}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        >
                                            <option value="system">System Default</option>
                                            <option value="light">Light Mode</option>
                                            <option value="dark">Dark Mode</option>
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Override system theme preference
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Fullscreen Mode</label>
                                        <select
                                            name="fullscreen_mode"
                                            value={formData.fullscreen_mode || 'auto'}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 dark:bg-gray-700/50 dark:text-white backdrop-blur-sm transition-all duration-200"
                                        >
                                            <option value="auto">Auto (Tablet Only)</option>
                                            <option value="on">Always On</option>
                                            <option value="off">Always Off</option>
                                        </select>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {isTablet() ? 'Tablet detected - fullscreen available' : 'Not a tablet device'}
                                        </p>
                                        {isTablet() && (
                                            <button
                                                type="button"
                                                onClick={toggleFullscreen}
                                                className="mt-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md hover:shadow-lg text-sm transition-all duration-200 backdrop-blur-sm"
                                            >
                                                Toggle Fullscreen Now
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl transition-all duration-200 backdrop-blur-sm"
                                >
                                    {saving ? 'Saving...' : 'Save Settings'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

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

export default Settings;