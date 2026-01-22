import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/mongodb";
import Registration from "@/src/models/Registration";

export async function DELETE(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        await connectToDatabase();

        const registration = await Registration.findByIdAndDelete(id);

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
    } catch (error) {
        console.error("Delete registration error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to delete registration" } },
            { status: 500 }
        );
    }
}
