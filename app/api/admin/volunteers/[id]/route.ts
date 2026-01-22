import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Volunteer from "@/src/models/Volunteer";
import { z } from "zod";

const updateStatusSchema = z.object({
    status: z.enum(["pending", "approved", "rejected"]),
});

type Params = { id: string };

export async function GET(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    const { id } = await context.params;

    try {
        await connectToDatabase();

        const volunteer = await Volunteer.findById(id);

        if (!volunteer) {
            return NextResponse.json(
                { success: false, error: { message: "Volunteer not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: volunteer });
    } catch (error) {
        console.error("Get volunteer error:", error);
        return NextResponse.json(
            { success: false, error: { message: "Failed to fetch volunteer" } },
            { status: 500 }
        );
    }
}

export async function PUT(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    const { id } = await context.params;

    try {
        await connectToDatabase();

        const body = await request.json();
        const { status } = updateStatusSchema.parse(body);

        const volunteer = await Volunteer.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!volunteer) {
            return NextResponse.json(
                { success: false, error: { message: "Volunteer not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: volunteer,
            message: `Volunteer status updated to ${status}`,
        });
    } catch (error) {
        console.error("Update volunteer error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: { message: "Invalid status" } },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: { message: "Failed to update volunteer" } },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<Params> }
) {
    const { id } = await context.params;

    try {
        await connectToDatabase();

        const volunteer = await Volunteer.findByIdAndDelete(id);

        if (!volunteer) {
            return NextResponse.json(
                { success: false, error: { message: "Volunteer not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Volunteer deleted successfully",
        });
    } catch (error) {
        console.error("Delete volunteer error:", error);
        return NextResponse.json(
            { success: false, error: { message: "Failed to delete volunteer" } },
            { status: 500 }
        );
    }
}
