import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Testimony from "@/src/models/Testimony";
import { z } from "zod";

const updateSchema = z.object({
    isApproved: z.boolean().optional(),
    isPublished: z.boolean().optional(),
});

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const body = await request.json();
        const validatedData = updateSchema.parse(body);

        const testimony = await Testimony.findByIdAndUpdate(
            params.id,
            validatedData,
            { new: true }
        );

        if (!testimony) {
            return NextResponse.json(
                { success: false, error: { message: "Testimony not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: testimony,
        });
    } catch (error: any) {
        console.error("Update testimony error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to update testimony" } },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const testimony = await Testimony.findByIdAndDelete(params.id);

        if (!testimony) {
            return NextResponse.json(
                { success: false, error: { message: "Testimony not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Testimony deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete testimony error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to delete testimony" } },
            { status: 500 }
        );
    }
}
