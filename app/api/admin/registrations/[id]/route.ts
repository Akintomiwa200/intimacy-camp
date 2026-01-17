import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Registration from "@/src/models/Registration";

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await connectDB();

        const registration = await Registration.findByIdAndDelete(params.id);

        if (!registration) {
            return NextResponse.json(
                { success: false, error: { message: "Registration not found" } },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: "Registration deleted successfully",
        });
    } catch (error: any) {
        console.error("Delete registration error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to delete registration" } },
            { status: 500 }
        );
    }
}
