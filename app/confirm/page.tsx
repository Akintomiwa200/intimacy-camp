"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Loader2, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ROUTES } from "@/src/lib/constants";

function ConfirmContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResult, setSearchResult] = useState<any>(null);
    const [searching, setSearching] = useState(false);

    useEffect(() => {
        if (token) {
            confirmRegistration();
        }
    }, [token]);

    const confirmRegistration = async () => {
        try {
            const response = await fetch("/api/registration/confirm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token }),
            });

            const data = await response.json();

            if (data.success) {
                setStatus("success");
                setMessage(data.data.message);
            } else {
                setStatus("error");
                setMessage(data.error.message);
            }
        } catch (error) {
            setStatus("error");
            setMessage("Failed to confirm registration. Please try again.");
        }
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setSearching(true);
        setSearchResult(null);

        try {
            // This would call an API to search for registration
            // For now, we'll show a placeholder
            setTimeout(() => {
                setSearchResult({ found: false });
                setSearching(false);
            }, 1000);
        } catch (error) {
            setSearching(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-2xl"
            >
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="inline-block bg-white/90 backdrop-blur-sm p-4 rounded-2xl shadow-lg mb-6">
                        <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
                            YMR
                        </div>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-serif text-white mb-2">
                        YMR 2025
                    </h1>
                    <p className="text-xl text-white/90 font-light italic">
                        Confirm Registration
                    </p>
                    <p className="text-white/80 mt-2">
                        Search for your registration and mark attendance
                    </p>
                </div>

                {/* Main Card */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    {token ? (
                        // Token-based confirmation
                        <div className="text-center">
                            {status === "loading" && (
                                <div className="py-12">
                                    <Loader2 className="w-16 h-16 mx-auto text-purple-600 animate-spin mb-4" />
                                    <p className="text-gray-600">Confirming your registration...</p>
                                </div>
                            )}

                            {status === "success" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                    className="py-8"
                                >
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Registration Confirmed!
                                    </h2>
                                    <p className="text-gray-600 mb-8">{message}</p>
                                    <Link href={ROUTES.LOGIN}>
                                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}

                            {status === "error" && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", duration: 0.6 }}
                                    className="py-8"
                                >
                                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-400 to-red-500 flex items-center justify-center">
                                        <XCircle className="w-12 h-12 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                        Confirmation Failed
                                    </h2>
                                    <p className="text-gray-600 mb-8">{message}</p>
                                    <Link href={ROUTES.REGISTER}>
                                        <Button variant="outline" size="lg">
                                            Back to Registration
                                        </Button>
                                    </Link>
                                </motion.div>
                            )}
                        </div>
                    ) : (
                        // Search-based confirmation
                        <div>
                            <div className="mb-6">
                                <label className="block text-sm text-gray-600 mb-2 italic">
                                    Search by first name, last name, email or reg code
                                </label>
                                <div className="flex gap-2">
                                    <Input
                                        type="text"
                                        placeholder="Enter search term..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                                        className="flex-1 h-12 text-lg"
                                    />
                                    <Button
                                        onClick={handleSearch}
                                        disabled={searching || !searchQuery.trim()}
                                        className="bg-gray-900 hover:bg-gray-800 px-8"
                                        size="lg"
                                    >
                                        {searching ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            "Search"
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {searchResult && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-6 bg-gray-50 rounded-xl text-center"
                                >
                                    <p className="text-gray-600 italic">No results found</p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Please check your search term and try again
                                    </p>
                                </motion.div>
                            )}

                            {!searchResult && (
                                <div className="mt-8 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Haven't registered yet?{" "}
                                        <Link href={ROUTES.REGISTER} className="text-purple-600 hover:text-purple-700 font-medium">
                                            Register here
                                        </Link>
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200">
                <Loader2 className="w-16 h-16 text-purple-600 animate-spin" />
            </div>
        }>
            <ConfirmContent />
        </Suspense>
    );
}
