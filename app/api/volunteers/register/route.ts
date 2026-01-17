import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Volunteer from "@/src/models/Volunteer";
import { generateConfirmationToken } from "@/src/lib/auth";
import { sendConfirmationEmail } from "@/src/lib/email";
import { geocodeAddress } from "@/src/lib/geocoding";
import { z } from "zod";

const volunteerSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(1),
    dateOfBirth: z.string().min(1),
    skills: z.array(z.string()),
    experience: z.string().min(1),
    previousVolunteer: z.boolean(),
    availableDates: z.array(z.string()),
    hoursPerWeek: z.string().min(1),
    location: z.object({
        address: z.string().min(1),
        coordinates: z.object({
            lat: z.number(),
            lng: z.number(),
        }).optional(),
        formattedAddress: z.string().optional(),
    }),
    documents: z.object({
        certification: z.string().optional(),
        backgroundCheck: z.string().optional(),
    }).optional(),
    motivation: z.string().min(1),
    references: z.string().optional(),
});

export async function POST(request: NextRequest) {
    try {
        await connectDB();

        const body = await request.json();
        const validatedData = volunteerSchema.parse(body);

        // Check if already registered
        const existingVolunteer = await Volunteer.findOne({
            email: validatedData.email,
            isConfirmed: true
        });

        if (existingVolunteer) {
            return NextResponse.json(
                { success: false, error: { message: "You have already registered as a volunteer" } },
                { status: 400 }
            );
        }

        // Geocode address if coordinates not provided
        let location = validatedData.location;
        if (!location.coordinates) {
            const geocoded = await geocodeAddress(location.address);
            if (geocoded) {
                location = {
                    address: location.address,
                    coordinates: {
                        lat: geocoded.lat,
                        lng: geocoded.lng,
                    },
                    formattedAddress: geocoded.formattedAddress,
                };
            }
        }

        // Generate confirmation token
        const confirmationToken = generateConfirmationToken();

        // Create volunteer registration
        const volunteer = await Volunteer.create({
            ...validatedData,
            location,
            confirmationToken,
            isConfirmed: false,
            status: "pending",
        });

        // Send confirmation email
        await sendConfirmationEmail(
            validatedData.email,
            validatedData.firstName,
            confirmationToken,
            "volunteer"
        );

        return NextResponse.json({
            success: true,
            data: {
                volunteerId: volunteer._id,
                message: "Volunteer application submitted successfully. Please check your email to confirm.",
            },
        });
    } catch (error: any) {
        console.error("Volunteer registration error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid input data", details: error.errors } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Volunteer registration failed" } },
            { status: 500 }
        );
    }
}
