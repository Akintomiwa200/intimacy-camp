"use client";

import { motion } from "framer-motion";
import { Users, Flame, BookOpen, Target } from "lucide-react";
import Image from "next/image";

const ITEMS = [
    { title: "Raising Kingdom Leaders", icon: Users, active: true },
    { title: "Igniting Revival Fire", icon: Flame, active: false },
    { title: "Discipleship & Mentorship", icon: BookOpen, active: false },
    { title: "Activating Purpose", icon: Target, active: false },
];

export function WhoWeAreSection() {
    return (
        <section className="bg-[#f2f1e8] py-24 overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Text Area */}
                    <div className="lg:w-1/2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                                Who We Are
                            </span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
                            Igniting A <span className="text-green-600">Burning Generation</span> On Fire For Jesus
                        </h2>

                        <div className="grid grid-cols-1 gap-4">
                            {ITEMS.map((item, index) => (
                                <motion.div
                                    key={index}
                                    whileHover={{ x: 10 }}
                                    className={`flex items-center gap-4 p-4 rounded-full transition-all duration-300 cursor-pointer ${item.active
                                            ? "bg-[#1a2b2b] text-white shadow-lg"
                                            : "text-gray-700 hover:bg-white"
                                        }`}
                                >
                                    <div className={`p-2 rounded-full ${item.active ? "bg-white/10" : "bg-gray-200"}`}>
                                        <item.icon className={`w-5 h-5 ${item.active ? "text-green-500" : "text-gray-500"}`} />
                                    </div>
                                    <span className="font-bold">{item.title}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Image Area */}
                    <div className="lg:w-1/2 relative">
                        <div className="absolute top-0 right-0 max-w-sm text-sm text-gray-600 leading-relaxed mb-8 hidden lg:block">
                            We are a global movement raising a passionate generation empowered to influence nations with the fire and truth of Jesus.
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-2xl mt-8 lg:mt-24"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80" // Crowd worshippers placeholder
                                alt="Who We Are"
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
