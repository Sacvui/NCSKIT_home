"use client";

import { useState, type FormEvent } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { LanguageProvider, useLanguageContext } from "../components/LanguageProvider";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
    return (
        <LanguageProvider>
            <LoginPageContent />
        </LanguageProvider>
    );
}

function LoginPageContent() {
    const { copy } = useLanguageContext();
    const { nav, headerCtas } = copy;
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email,
                password,
            });

            if (result?.error) {
                setError("Invalid email or password. Please try again.");
            } else {
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    router.push("/");
                }, 1000);
            }
        } catch (error) {
            console.error("Login failed", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        // Validation
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setIsLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long.");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Registration failed. Please try again.");
            } else {
                setSuccess("Registration successful! You can now log in.");
                // Clear form and switch to login
                setTimeout(() => {
                    setName("");
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setIsLogin(true);
                    setSuccess(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Registration failed", error);
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Header nav={nav} headerCtas={headerCtas} />
            <main className="min-h-screen pt-24 pb-20 flex items-center justify-center relative overflow-hidden">
                {/* Background Elements */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 -z-10" />
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-200/20 rounded-full blur-3xl" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl" />
                </div>

                <motion.div
                    className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/50"
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                >
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="w-32 h-32 mx-auto mb-4 flex items-center justify-center"
                        >
                            <Image 
                                src="/assets/logo.png" 
                                alt="NCSKIT Logo" 
                                width={128}
                                height={128}
                                className="w-full h-full object-contain" 
                            />
                        </motion.div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                            {isLogin ? "Welcome Back" : "Create Account"}
                        </h1>
                        <p className="text-gray-500 mt-2">
                            {isLogin
                                ? "Sign in to access your Research OS"
                                : "Join NCSKIT to start your research journey"}
                        </p>
                    </div>

                    {/* Error/Success Messages */}
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
                            >
                                {error}
                            </motion.div>
                        )}
                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
                            >
                                {success}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Toggle Buttons */}
                    <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-xl">
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(true);
                                setError(null);
                                setSuccess(null);
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${isLogin
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setIsLogin(false);
                                setError(null);
                                setSuccess(null);
                            }}
                            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${!isLogin
                                ? "bg-white text-blue-600 shadow-sm"
                                : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            Sign Up
                        </button>
                    </div>

                    {/* OAuth Providers */}
                    <div className="space-y-3 mb-6">
                        <button
                            type="button"
                            onClick={() => signIn('google', { callbackUrl: '/' })}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-all shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            <span className="font-medium text-gray-700">Continue with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => signIn('linkedin', { callbackUrl: '/' })}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0077B5] text-white rounded-xl hover:bg-[#006399] transition-all shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                            </svg>
                            <span className="font-medium">Continue with LinkedIn</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => signIn('orcid', { callbackUrl: '/' })}
                            className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#A6CE39] text-white rounded-xl hover:bg-[#8FB82E] transition-all shadow-sm hover:shadow"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.022-5.325 5.022h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 4.053-1.303 4.053-3.722 0-2.219-1.497-3.722-3.925-3.722h-2.425z" />
                            </svg>
                            <span className="font-medium">Continue with ORCID</span>
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-gray-500">Or continue with email</span>
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {isLogin ? (
                            <motion.form
                                key="login"
                                onSubmit={handleLogin}
                                className="space-y-5"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Email or Username</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="your@email.com or username"
                                            required
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="••••••••"
                                            required
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                                        <span className="text-gray-500 group-hover:text-gray-700 transition-colors">Remember me</span>
                                    </label>
                                    <a href="#" className="text-blue-600 font-medium hover:text-blue-700 hover:underline">Forgot password?</a>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Signing in...
                                        </>
                                    ) : (
                                        "Sign In"
                                    )}
                                </button>
                            </motion.form>
                        ) : (
                            <motion.form
                                key="register"
                                onSubmit={handleRegister}
                                className="space-y-5"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="John Doe"
                                            required
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="your@email.com"
                                            required
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="At least 6 characters"
                                            required
                                            minLength={6}
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                            placeholder="Re-enter password"
                                            required
                                            minLength={6}
                                        />
                                        <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full py-3.5 px-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Creating account...
                                        </>
                                    ) : (
                                        "Create Account"
                                    )}
                                </button>
                            </motion.form>
                        )}
                    </AnimatePresence>

                    <div className="mt-6 text-center text-sm text-gray-500">
                        {isLogin ? (
                            <>
                                Don&apos;t have an account?{" "}
                                <button
                                    onClick={() => setIsLogin(false)}
                                    className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                                >
                                    Sign up for free
                                </button>
                            </>
                        ) : (
                            <>
                                Already have an account?{" "}
                                <button
                                    onClick={() => setIsLogin(true)}
                                    className="text-blue-600 font-medium hover:text-blue-700 hover:underline"
                                >
                                    Sign in
                                </button>
                            </>
                        )}
                    </div>
                </motion.div>
            </main>
            <Footer />
        </>
    );
}
