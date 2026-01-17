import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Volunteer from "@/src/models/Volunteer";
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

        // Find volunteer by token
        const volunteer = await Volunteer.findOne({ confirmationToken: token });

        if (!volunteer) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid or expired confirmation token" } },
                { status: 400 }
            );
        }

        if (volunteer.isConfirmed) {
            return NextResponse.json(
                { success: false, error: { message: "Application already confirmed" } },
                { status: 400 }
            );
        }

        // Update volunteer
        volunteer.isConfirmed = true;
        volunteer.confirmedAt = new Date();
        volunteer.confirmationToken = undefined;
        await volunteer.save();

        // Send welcome email
        await sendWelcomeEmail(
            volunteer.email,
            volunteer.firstName,
            "volunteer"
        );

        return NextResponse.json({
            success: true,
            data: {
                message: "Volunteer application confirmed successfully!",
            },
        });
    } catch (error: any) {
        console.error("Volunteer confirmation error:", error);

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
