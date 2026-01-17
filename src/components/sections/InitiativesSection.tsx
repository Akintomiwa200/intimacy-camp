"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

const INITIATIVES = [
    {
        title: "Youth Aflame Conference",
        description: "YAC is an expression of YMR for the young professionals and those who aspire to be professionals in their careers.",
        image: "https://images.unsplash.com/photo-1475721027187-402ad2989a3b?auto=format&fit=crop&q=80",
        color: "bg-[#1a2b2b]"
    },
    {
        title: "RCCG The Envoys",
        description: "Envoys is a young people church expression of RCCG with the mandate of raising kingdom ambassadors.",
        image: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80",
        color: "bg-green-700"
    },
    {
        title: "City To City Fire Conference",
        description: "CFC is a YMR initiative, reigniting the revival fire in specific cities across the globe.",
        image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
        color: "bg-[#1a2b2b]"
    },
    {
        title: "YMR Samaritan",
        description: "It is the platform where we help and support the ymr participants with basically education, empowerment and healthcare.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80",
        color: "bg-[#f2f1e8]"
    }
];

export function InitiativesSection() {
    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16 relative">
                    {/* Decorative elements */}
                    <div className="absolute top-0 left-10 md:left-40 opacity-20 hidden md:block">
                        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                            <path d="M10 50 Q50 10 90 50" stroke="currentColor" strokeWidth="2" strokeDasharray="5 5" />
                        </svg>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        <span className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
                            YMR Initiatives
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 max-w-2xl mx-auto leading-tight">
                        Overflowing Impact, <span className="text-green-600">Expanding Vision</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-gray-600 leading-relaxed text-sm md:text-base">
                        Due to the explosive growth and undeniable impact of YMR by the hand of God, several powerful initiatives have been supernaturally birthed from the vision—each carrying the same fire, passion, and mandate to raise a burning generation and expand the kingdom across various fronts.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {INITIATIVES.map((initiative, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`${initiative.color} rounded-3xl overflow-hidden shadow-xl min-h-[400px] flex flex-col group`}
                        >
                            <div className="relative flex-1 p-8 flex flex-col justify-end">
                                <Image
                                    src={initiative.image}
                                    alt={initiative.title}
                                    fill
                                    className="object-cover opacity-40 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute top-8 right-8">
                                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white group-hover:text-black transition-colors">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="relative z-10">
                                    <h4 className={`text-2xl font-bold mb-3 ${initiative.color === "bg-[#f2f1e8]" ? "text-gray-900" : "text-white"}`}>
                                        {initiative.title}
                                    </h4>
                                    <p className={`text-sm leading-relaxed ${initiative.color === "bg-[#f2f1e8]" ? "text-gray-600" : "text-white/70"}`}>
                                        {initiative.description}
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
