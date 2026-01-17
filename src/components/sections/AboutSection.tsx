"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

export function AboutSection() {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    const highlights = [
        "Expert-led workshops and guided sessions",
        "Safe, judgment-free environment",
        "Evidence-based intimacy practices",
        "Small group sizes for personalized attention",
        "Beautiful retreat setting",
        "Lifetime access to our community",
    ];

    return (
        <section id="about" ref={ref} className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="space-y-6"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold">
                            About{" "}
                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Our Program
                            </span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Intimacy Camp is a transformative experience designed to help
                            individuals and couples deepen their connections, overcome
                            barriers to intimacy, and develop lasting skills for authentic
                            relationships.
                        </p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            Our program combines evidence-based practices with experiential
                            learning in a supportive, beautiful retreat setting. Led by
                            certified relationship coaches and intimacy experts, you'll
                            discover powerful tools for emotional and physical connection.
                        </p>

                        {/* Highlights */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                            {highlights.map((highlight, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={isVisible ? { opacity: 1, x: 0 } : {}}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                    className="flex items-start gap-3"
                                >
                                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                                    <span className="text-gray-700 dark:text-gray-300">
                                        {highlight}
                                    </span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Image Placeholder */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={isVisible ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-2xl bg-gradient-to-br from-purple-600 to-pink-600 p-1">
                            <div className="w-full h-full rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                {/* Placeholder for image */}
                                <div className="relative w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
                                    <div className="text-center space-y-4">
                                        <div className="text-6xl">💑</div>
                                        <p className="text-gray-600 dark:text-gray-400 font-medium">
                                            Transformative Experiences
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600 rounded-full blur-3xl opacity-30" />
                        <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-pink-600 rounded-full blur-3xl opacity-30" />
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
