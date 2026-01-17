"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Mail, Lock } from "lucide-react";
import { Header } from "@/src/components/layout/Header";
import Footer from "@/src/components/layout/Footer";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES, APP_NAME } from "@/src/lib/constants";

export default function LoginPage() {
    const router = useRouter();
    const { login, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const result = await login({ email, password });

        if (result.success) {
            router.push(ROUTES.DASHBOARD);
        } else {
            setError(result.error || "Login failed");
        }
    };

    return (
        <main className="min-h-screen bg-gradient-to-br from-purple-900 via-pink-800 to-purple-900">
            <Header />

            <div className="container mx-auto px-4 py-24 flex items-center justify-center min-h-[calc(100vh-200px)]">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-md"
                >
                    <Card className="backdrop-blur-sm bg-white/95 dark:bg-gray-900/95">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                    <Heart className="w-8 h-8 text-white fill-white" />
                                </div>
                            </div>
                            <CardTitle className="text-3xl">Welcome Back</CardTitle>
                            <CardDescription className="text-base">
                                Login to access your {APP_NAME} dashboard
                            </CardDescription>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-4">
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="Email address"
                                            required
                                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Password"
                                            required
                                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>

                                {error && (
                                    <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full"
                                    size="lg"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Logging in..." : "Login"}
                                </Button>

                                <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                                    Don't have an account?{" "}
                                    <Link
                                        href={ROUTES.REGISTER}
                                        className="text-purple-600 hover:text-purple-700 font-medium"
                                    >
                                        Register here
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-6 text-center text-white/80 text-sm space-y-2"
                    >
                        <p>
                            By logging in, you agree to our Terms of Service and Privacy
                            Policy
                        </p>
                        <div className="pt-4 border-t border-white/20">
                            <p className="text-white/60 text-xs">
                                Admin Login: <span className="font-mono bg-white/10 px-2 py-1 rounded">admin@user.com</span> / <span className="font-mono bg-white/10 px-2 py-1 rounded">admin</span>
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <Footer />
        </main>
    );
}
