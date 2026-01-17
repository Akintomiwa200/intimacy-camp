"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ROUTES } from "@/src/lib/constants";

const STEPS = [
    { id: 1, title: "Personal Info", fields: ["firstName", "lastName"] },
    { id: 2, title: "Contact", fields: ["email", "phone"] },
    { id: 3, title: "Camp Details", fields: ["campDate", "accommodationType"] },
    { id: 4, title: "Dietary Info", fields: ["dietaryRestrictions"] },
    { id: 5, title: "Emergency Contact", fields: ["emergencyContactName", "emergencyContactPhone", "emergencyContactRelation"] },
    { id: 6, title: "Experience", fields: ["experience"] },
    { id: 7, title: "Goals", fields: ["goals"] },
    { id: 8, title: "Medical Info", fields: ["medicalConditions"] },
];

export default function RegisterPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        campDate: "",
        accommodationType: "shared",
        dietaryRestrictions: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        emergencyContactRelation: "",
        experience: "",
        goals: "",
        medicalConditions: "",
    });

    const handleInputChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const canProceed = () => {
        const currentFields = STEPS[currentStep - 1].fields;
        return currentFields.every((field) => {
            if (field === "dietaryRestrictions" || field === "experience" || field === "goals" || field === "medicalConditions") {
                return true; // Optional fields
            }
            return formData[field as keyof typeof formData]?.trim() !== "";
        });
    };

    const handleNext = () => {
        if (currentStep < STEPS.length && canProceed()) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleSubmit = async () => {
        if (!canProceed()) return;

        setIsSubmitting(true);

        try {
            const response = await fetch("/api/registration/submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (data.success) {
                setIsSuccess(true);
            } else {
                alert(data.error.message || "Registration failed");
            }
        } catch (error) {
            alert("Failed to submit registration");
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        const step = STEPS[currentStep - 1];

        return (
            <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
            >
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">{step.title}</h3>

                {step.id === 1 && (
                    <>
                        <Input
                            label="First Name"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange("firstName", e.target.value)}
                            required
                        />
                        <Input
                            label="Last Name"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange("lastName", e.target.value)}
                            required
                        />
                    </>
                )}

                {step.id === 2 && (
                    <>
                        <Input
                            label="Email Address"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange("email", e.target.value)}
                            required
                        />
                        <Input
                            label="Phone Number"
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            required
                        />
                    </>
                )}

                {step.id === 3 && (
                    <>
                        <Input
                            label="Preferred Camp Date"
                            type="date"
                            value={formData.campDate}
                            onChange={(e) => handleInputChange("campDate", e.target.value)}
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Accommodation Type
                            </label>
                            <select
                                value={formData.accommodationType}
                                onChange={(e) => handleInputChange("accommodationType", e.target.value)}
                                className="w-full h-11 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            >
                                <option value="shared">Shared Room</option>
                                <option value="private">Private Room</option>
                                <option value="couple">Couple Room</option>
                            </select>
                        </div>
                    </>
                )}

                {step.id === 4 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Dietary Restrictions (Optional)
                        </label>
                        <textarea
                            value={formData.dietaryRestrictions}
                            onChange={(e) => handleInputChange("dietaryRestrictions", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Any allergies or dietary preferences..."
                        />
                    </div>
                )}

                {step.id === 5 && (
                    <>
                        <Input
                            label="Emergency Contact Name"
                            value={formData.emergencyContactName}
                            onChange={(e) => handleInputChange("emergencyContactName", e.target.value)}
                            required
                        />
                        <Input
                            label="Emergency Contact Phone"
                            type="tel"
                            value={formData.emergencyContactPhone}
                            onChange={(e) => handleInputChange("emergencyContactPhone", e.target.value)}
                            required
                        />
                        <Input
                            label="Relationship"
                            value={formData.emergencyContactRelation}
                            onChange={(e) => handleInputChange("emergencyContactRelation", e.target.value)}
                            placeholder="e.g., Parent, Spouse, Sibling"
                            required
                        />
                    </>
                )}

                {step.id === 6 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Previous Retreat Experience (Optional)
                        </label>
                        <textarea
                            value={formData.experience}
                            onChange={(e) => handleInputChange("experience", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Tell us about your previous retreat experiences..."
                        />
                    </div>
                )}

                {step.id === 7 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            What are your goals for this retreat? (Optional)
                        </label>
                        <textarea
                            value={formData.goals}
                            onChange={(e) => handleInputChange("goals", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="What do you hope to gain from this retreat..."
                        />
                    </div>
                )}

                {step.id === 8 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Medical Conditions (Optional)
                        </label>
                        <textarea
                            value={formData.medicalConditions}
                            onChange={(e) => handleInputChange("medicalConditions", e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Any medical conditions we should be aware of..."
                        />
                    </div>
                )}
            </motion.div>
        );
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 via-purple-200 to-blue-200 p-4">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", duration: 0.6 }}
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center max-w-md"
                >
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Registration Submitted!
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Please check your email to confirm your registration.
                    </p>
                    <Link href={ROUTES.HOME}>
                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                            Back to Home
                        </Button>
                    </Link>
                </motion.div>
            </div>
        );
    }

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
                        Registration
                    </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between mb-2">
                        {STEPS.map((step) => (
                            <div
                                key={step.id}
                                className={`w-full h-2 mx-1 rounded-full transition-colors ${step.id <= currentStep
                                        ? "bg-gradient-to-r from-purple-600 to-pink-600"
                                        : "bg-white/30"
                                    }`}
                            />
                        ))}
                    </div>
                    <p className="text-center text-white text-sm">
                        Step {currentStep} of {STEPS.length}
                    </p>
                </div>

                {/* Main Card */}
                <motion.div
                    className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 md:p-12"
                >
                    <AnimatePresence mode="wait">
                        {renderStepContent()}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {currentStep > 1 && (
                            <Button
                                variant="outline"
                                onClick={handlePrevious}
                                className="flex-1"
                                size="lg"
                            >
                                <ChevronLeft className="w-5 h-5 mr-2" />
                                Previous
                            </Button>
                        )}

                        {currentStep < STEPS.length ? (
                            <Button
                                onClick={handleNext}
                                disabled={!canProceed()}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                                size="lg"
                            >
                                Next
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={!canProceed() || isSubmitting}
                                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                                size="lg"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="w-5 h-5 mr-2" />
                                        Submit Registration
                                    </>
                                )}
                            </Button>
                        )}
                    </div>

                    <div className="mt-6 text-center text-sm text-gray-600">
                        Already registered?{" "}
                        <Link href="/confirm" className="text-purple-600 hover:text-purple-700 font-medium">
                            Confirm here
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
}
