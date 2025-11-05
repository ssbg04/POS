import { useState } from "react";
import {
    AiOutlineEye,
    AiOutlineEyeInvisible,
    AiOutlineUser,
    AiOutlineLock,
    AiOutlineBulb,
} from "react-icons/ai";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../context/AuthContext";
import './bg.css'

const Login = () => {
    const { login: authLogin, loading, error } = useAuth(); // backend auth
    const { login: setUser } = useAuthContext(); // context setter
    const navigate = useNavigate();

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [formData, setFormData] = useState({ username: "", password: "" });

    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Authenticate via backend
            const loggedInUser = await authLogin(formData.username, formData.password);

            // Save session to context/localStorage
            const userData = {
                user_id: loggedInUser.user_id,
                username: loggedInUser.username,
                full_name: loggedInUser.full_name,
                role: loggedInUser.role,
            };
            setUser(userData);
            if (loggedInUser.role === "admin") navigate("/home");
            else if (loggedInUser.role === "cashier") navigate("/pos");
            else navigate("/login");
        } catch (err) {
            console.error("Login failed:", err);
        }
    };

    return (
        <div
            className={`min-h-screen flex items-center justify-center relative overflow-hidden ${darkMode ? "text-white" : "text-gray-900"
                }`}
        >
            {/* Animated Gradient Background */}
            <div className="absolute inset-0 animate-gradientDark bg-gradient-to-br from-[#0a192f] via-[#112240] via-[#233554] to-[#0a192f]"></div>

            {/* Glossy Overlays */}
            <div className="absolute inset-0 opacity-20 bg-white blur-3xl rotate-12 scale-150"></div>
            <div className="absolute inset-0 opacity-10 bg-white blur-2xl -rotate-6 scale-125"></div>
            <div className="absolute inset-0 bg-black opacity-30"></div>

            <div className="relative z-10 w-full max-w-sm p-6">
                {/* Dark Mode Toggle */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-yellow-400 hover:bg-yellow-300 text-gray-900 z-20"
                    title="Toggle Dark Mode"
                >
                    <AiOutlineBulb size={24} />
                </button>

                {/* Glassy Login Form */}
                <div
                    className={`select-none backdrop-blur-xl bg-white/20 ${darkMode ? "bg-gray-800/30 text-white" : "text-gray-900"
                        } rounded-2xl shadow-2xl p-8 border border-white/30`}
                >
                    <h2 className="text-2xl font-bold text-center mb-6">POS Login</h2>
                    {error && <p className="text-red-500 mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div className="relative">
                            <AiOutlineUser className="absolute left-3 top-3 text-gray-300" />
                            <input
                                type="text"
                                name="username"
                                placeholder="Username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-4 py-2 rounded-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 ${darkMode
                                    ? "text-white placeholder-gray-300"
                                    : "text-gray-900 placeholder-gray-500"
                                    }`}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <AiOutlineLock className="absolute left-3 top-3 text-gray-300" />
                            <input
                                type={passwordVisible ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                className={`w-full pl-10 pr-10 py-2 rounded-lg border border-white/40 focus:outline-none focus:ring-2 focus:ring-white/50 bg-white/10 ${darkMode
                                    ? "text-white placeholder-gray-300"
                                    : "text-gray-900 placeholder-gray-500"
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute right-3 top-2.5 text-gray-200 hover:text-white"
                            >
                                {passwordVisible ? (
                                    <AiOutlineEyeInvisible size={20} />
                                ) : (
                                    <AiOutlineEye size={20} />
                                )}
                            </button>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full py-2 rounded-lg cursor-pointer font-semibold transition-all duration-300 ${darkMode
                                ? "bg-green-600 hover:bg-green-700 text-white disabled:opacity-50"
                                : "bg-gray-800 hover:bg-black text-white disabled:opacity-50"
                                }`}
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>
                </div>
            </div>

            {/* Animated Gradient Pulse */}
            <style jsx>{`
        .animate-gradientPulse {
          background-size: 400% 400%;
          animation: gradientPulse 10s ease infinite,
            pulseOpacity 5s ease-in-out infinite alternate;
        }
        @keyframes gradientPulse {
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
        @keyframes pulseOpacity {
          0% {
            opacity: 0.8;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0.8;
          }
        }
      `}</style>
        </div>
    );
};

export default Login;
