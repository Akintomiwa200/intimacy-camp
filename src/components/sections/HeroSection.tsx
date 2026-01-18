"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { Button } from "@/src/components/ui/button";
import { Card } from "@/src/components/ui/card";
import { ROUTES } from "@/src/lib/constants";


const HERO_IMAGES = [
    "/images/IMG-20260116-WA0109.jpg", 
    "/images/IMG-20260116-WA0116.jpg", 
    "/images/IMG-20260116-WA0113.jpg", 
    "/images/IMG-20260116-WA0107.jpg", 
    "/images/IMG-20260116-WA0104.jpg", 
];


const STATS = [
    {
        value: "1",
        label: "Nations Reached",
        icon: "🌍",
        bgColor: "bg-teal-900/80",
    },
    {
        value: "99+",
        label: "Souls Saved",
        icon: "💚",
        bgColor: "bg-amber-100/90",
        textColor: "text-gray-400",
    },
    {
        value: "20+",
        label: "Volunteers",
        icon: "👥",
        bgColor: "bg-teal-900/80",
    },
    {
        value: "100+",
        label: "People on Fire",
        icon: "🔥",
        bgColor: "bg-teal-900/80",
        textColor: "text-gray-400",
    },
];

export function HeroSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prevIndex) =>
                (prevIndex + 1) % HERO_IMAGES.length
            );
        }, 8000); 

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
            {/* Background Image Carousel with Zoom Effect */}
            <div className="absolute inset-0">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentImageIndex}
                        initial={{ scale: 1, opacity: 0 }}
                        animate={{
                            scale: 1.1, // Zoom in effect
                            opacity: 1
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                            scale: { duration: 4, ease: "linear" },
                            opacity: { duration: 0.5 }
                        }}
                        className="absolute inset-0"
                    >
                        <Image
                            src={HERO_IMAGES[currentImageIndex]}
                            alt="The Intimacy Camp 2026"
                            fill
                            className="object-cover"
                            priority
                            quality={90}
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/50" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-24 py-32">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                   
       <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8 }}
    className="text-white space-y-8"
>
    {/* Badge */}
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/20 backdrop-blur-sm border border-green-500/30">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-sm font-medium text-green-300">
            The Intimacy Camp 2026
        </span>
    </div>

    {/* Main Heading */}
    <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
          Raising a   
        
        <span className="text-green-400"> Pure Breed</span>
        <br /> Of Mighty Men.
    </h1>

    {/* Description */}
    <p className="text-lg md:text-xl text-gray-200 max-w-2xl">
        The Intimacy Camp 2026 is a transformative camp meeting, for renewal and refreshing. 
    We have a mandate to raise a pure breed of mighty men, who will take the WISDOM and POWER of God into the Nations, to reshape every sphere of human influence, bringing then in conformity with the will of God. 
     At The Intimacy Camp, men are empowered with the wisdom and power of God, to realize their ordination, embrace their calling, grow in intimacy and be ignited with a burning passion that will translate into societal transformation.
    </p>

    {/* CTA Button */}
    <div className="pt-4">
        <Link href="#about">
            <Button
                size="lg"
                className="bg-white text-gray-900 hover:bg-gray-100 rounded-full px-8 group"
            >
                Learn More
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
        </Link>
    </div>
</motion.div>


                    {/* Right Stats Cards */}
                    <motion.div
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.8, delay: 0.2 }}
    className="grid grid-cols-2 gap-4"
>
    {STATS.map((stat, index) => (
        <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: index === 1 || index === 3 ? 32 : 0, // 2em ≈ 32px
            }}
            transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
        >
            <Card
                className={`${stat.bgColor} ${stat.textColor || "text-white"} border-none backdrop-blur-sm p-6 hover:scale-105 transition-transform duration-300`}
            >
                <div className="space-y-2">
                    <div className="text-3xl">{stat.icon}</div>
                    <div className="text-4xl font-bold">{stat.value}</div>
                    <div className={`text-sm ${stat.textColor ? "opacity-70" : "opacity-90"}`}>
                        {stat.label}
                    </div>
                </div>
            </Card>
        </motion.div>
    ))}
</motion.div>

                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
            >
                <div className="w-6 h-12 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
                    <motion.div
                        className="w-1.5 h-1.5 bg-white rounded-full"
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                </div>
            </motion.div>
        </section>
    );
}
