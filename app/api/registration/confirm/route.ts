import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Registration from "@/src/models/Registration";
import { sendWelcomeEmail } from "@/src/lib/email";
import { z } from "zod";

const confirmSchema = z.object({
    token: z.string(),
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const { token } = confirmSchema.parse(body);

        // Find registration by token
        const registration = await Registration.findOne({ confirmationToken: token });

        if (!registration) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid or expired confirmation token" } },
                { status: 400 }
            );
        }

        if (registration.isConfirmed) {
            return NextResponse.json(
                { success: false, error: { message: "Registration already confirmed" } },
                { status: 400 }
            );
        }

        // Update registration
        registration.isConfirmed = true;
        registration.confirmedAt = new Date();
        registration.confirmationToken = undefined;
        await registration.save();

        // Send welcome email
        await sendWelcomeEmail(
            registration.email,
            registration.firstName,
            "participant"
        );

        return NextResponse.json({
            success: true,
            data: {
                message: "Registration confirmed successfully!",
            },
        });
    } catch (error: any) {
        console.error("Registration confirmation error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid input data" } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Confirmation failed" } },
            { status: 500 }
        );
    }
}
