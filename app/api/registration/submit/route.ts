import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Registration from "@/src/models/Registration";
import { generateConfirmationToken } from "@/src/lib/auth";
import { sendConfirmationEmail } from "@/src/lib/email";
import { z } from "zod";

const registrationSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    campDate: z.string().min(1),
    accommodationType: z.enum(["shared", "private", "couple"]),
    dietaryRestrictions: z.string().optional(),
    emergencyContactName: z.string().min(1),
    emergencyContactPhone: z.string().min(1),
    emergencyContactRelation: z.string().min(1),
    experience: z.string().optional(),
    goals: z.string().optional(),
    medicalConditions: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validatedData = registrationSchema.parse(body);

        // Check if already registered
        const existingRegistration = await Registration.findOne({
            email: validatedData.email,
            isConfirmed: true
        });

        if (existingRegistration) {
            return NextResponse.json(
                { success: false, error: { message: "You have already registered" } },
                { status: 400 }
            );
        }

        // Generate confirmation token
        const confirmationToken = generateConfirmationToken();

        // Create registration
        const registration = await Registration.create({
            ...validatedData,
            confirmationToken,
            isConfirmed: false,
        });

        // Send confirmation email
        await sendConfirmationEmail(
            validatedData.email,
            validatedData.firstName,
            confirmationToken,
            "participant"
        );

        console.log(`✅ Real-time confirmation email sent to ${validatedData.email}`);

        return NextResponse.json({
            success: true,
            data: {
                registrationId: registration._id,
                message: "Registration submitted successfully. Please check your email to confirm.",
            },
        });
    } catch (error: any) {
        console.error("Registration submission error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid input data", details: error.errors } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Registration failed" } },
            { status: 500 }
        );
    }
}
