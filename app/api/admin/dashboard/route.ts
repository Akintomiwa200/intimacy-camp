import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/src/lib/mongodb";
import Registration from "@/src/models/Registration";
import Volunteer from "@/src/models/Volunteer";
import User from "@/src/models/User";

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        // Get all registrations
        const registrations = await Registration.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Get all volunteers
        const volunteers = await Volunteer.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Get all users
        const users = await User.find({})
            .select("-password")
            .sort({ createdAt: -1 })
            .lean();

        // Calculate statistics
        const stats = {
            totalRegistrations: registrations.length,
            confirmedRegistrations: registrations.filter(r => r.isConfirmed).length,
            pendingRegistrations: registrations.filter(r => !r.isConfirmed).length,

            totalVolunteers: volunteers.length,
            confirmedVolunteers: volunteers.filter(v => v.isConfirmed).length,
            pendingVolunteers: volunteers.filter(v => !v.isConfirmed && v.status === "pending").length,
            approvedVolunteers: volunteers.filter(v => v.status === "approved").length,
            rejectedVolunteers: volunteers.filter(v => v.status === "rejected").length,

            totalUsers: users.length,
            participants: users.filter(u => u.role === "participant").length,
            volunteerUsers: users.filter(u => u.role === "volunteer").length,
            admins: users.filter(u => u.role === "admin").length,
        };

        // Calculate registration trends (last 7 days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const trends = await Registration.aggregate([
            {
                $match: {
                    createdAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats,
                registrations,
                volunteers,
                users,
                registrationTrends: trends,
            },
        });
    } catch (error: any) {
        console.error("Admin dashboard error:", error);

        return NextResponse.json(
            { success: false, error: { message: "Failed to fetch dashboard data" } },
            { status: 500 }
        );
    }
}
