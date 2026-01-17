"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Users, Heart } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { ROUTES } from "@/src/lib/constants";
import { useIntersectionObserver } from "@/src/hooks/useIntersectionObserver";

export function CTASection() {
    const [ref, isVisible] = useIntersectionObserver({
        threshold: 0.1,
        freezeOnceVisible: true,
    });

    return (
        <section ref={ref} className="py-20 bg-white dark:bg-gray-950">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 to-pink-600 p-12 md:p-16"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />

                    {/* Floating Elements */}
                    <motion.div
                        className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"
                        animate={{
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />

                    <div className="relative z-10 text-center space-y-8">
                        {/* Icon Row */}
                        <div className="flex justify-center gap-4">
                            {[Calendar, Users, Heart].map((Icon, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={isVisible ? { opacity: 1, scale: 1 } : {}}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                                >
                                    <Icon className="w-6 h-6 text-white" />
                                </motion.div>
                            ))}
                        </div>

                        {/* Heading */}
                        <h2 className="text-4xl md:text-5xl font-bold text-white">
                            Ready to Transform Your Relationships?
                        </h2>

                        {/* Description */}
                        <p className="text-xl text-purple-100 max-w-2xl mx-auto">
                            Join hundreds of individuals and couples who have discovered
                            deeper connection and authentic intimacy. Limited spots
                            available for our next retreat.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                            <Link href={ROUTES.REGISTER}>
                                <Button
                                    size="xl"
                                    variant="secondary"
                                    className="group bg-white text-purple-600 hover:bg-gray-100"
                                >
                                    Register Now
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="#features">
                                <Button
                                    size="xl"
                                    variant="ghost"
                                    className="text-white border-white/30 hover:bg-white/10"
                                >
                                    Learn More
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto pt-8 border-t border-white/20">
                            {[
                                { value: "7 Days", label: "Retreat" },
                                { value: "Max 20", label: "Participants" },
                                { value: "$2,499", label: "Investment" },
                            ].map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={isVisible ? { opacity: 1, y: 0 } : {}}
                                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl md:text-3xl font-bold text-white">
                                        {item.value}
                                    </div>
                                    <div className="text-sm text-purple-100 mt-1">
                                        {item.label}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
