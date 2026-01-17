"use client";

import { motion } from "framer-motion";
import { Zap, Shield } from "lucide-react";
import Image from "next/image";

export function TheArmySection() {
    return (
        <section className="py-20 bg-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                            Featured Event
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                        Young Ministers Retreat
                    </h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-green-500">
                        The New Army
                    </h3>
                    <p className="max-w-3xl mx-auto mt-6 text-gray-600 leading-relaxed">
                        This December, a <span className="font-bold text-gray-900">New Army</span> is rising! From <span className="font-bold text-gray-900">December 26th – 30th, 2025</span>, at the <span className="font-bold text-gray-900">Old Auditorium, Redemption City of God</span>, thousands of young ministers will gather for an unforgettable encounter.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                    {/* Main Poster Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="md:col-span-5 relative group rounded-3xl overflow-hidden shadow-2xl min-h-[500px]"
                    >
                        <Image
                            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" // Placeholder for the actual poster
                            alt="The New Army Poster"
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                            <h4 className="text-white text-2xl font-bold mb-2">Young Ministers Retreat</h4>
                            <p className="text-white/80 text-sm leading-relaxed">
                                Convened by P. Daniel Olawande, this retreat is not just a meeting—it is a divine mobilization into destiny.
                            </p>
                            <div className="mt-4 text-white/60 text-xs font-medium tracking-wider uppercase">
                                Old Auditorium, Redemption City of God
                            </div>
                        </div>
                    </motion.div>

                    <div className="md:col-span-7 flex flex-col gap-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {/* Spiritual Renewal Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="bg-[#1a2b2b] p-8 rounded-3xl flex flex-col justify-between"
                            >
                                <Zap className="w-8 h-8 text-green-500 mb-6" />
                                <div>
                                    <h4 className="text-white text-xl font-bold mb-3">Spiritual Renewal</h4>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        Five days of intense worship, teaching, and life-transforming encounters.
                                    </p>
                                </div>
                            </motion.div>

                            {/* Army Mobilization Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-[#f2f1e8] p-8 rounded-3xl flex flex-col justify-between"
                            >
                                <Shield className="w-8 h-8 text-green-600 mb-6" />
                                <div>
                                    <h4 className="text-gray-900 text-xl font-bold mb-3">Army Mobilization</h4>
                                    <p className="text-gray-600 text-sm leading-relaxed">
                                        Equipping young ministers to influence culture and advance God's kingdom.
                                    </p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Large Crowd Image */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="flex-1 relative rounded-3xl overflow-hidden shadow-lg min-h-[250px]"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80"
                                alt="YMR Crowd"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
}
