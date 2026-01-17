"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
    Users,
    UserCheck,
    UserX,
    Clock,
    CheckCircle,
    XCircle,
    Trash2,
    RefreshCw,
    LogOut,
} from "lucide-react";
import { Header } from "@/src/components/layout/Header";
import { Footer } from "@/src/components/layout/Footer";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { useAuth } from "@/src/hooks/useAuth";
import { ROUTES } from "@/src/lib/constants";

interface DashboardStats {
    totalRegistrations: number;
    confirmedRegistrations: number;
    pendingRegistrations: number;
    totalVolunteers: number;
    confirmedVolunteers: number;
    pendingVolunteers: number;
    approvedVolunteers: number;
    rejectedVolunteers: number;
    totalUsers: number;
    participants: number;
    volunteerUsers: number;
    admins: number;
}

interface Registration {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    campDate: string;
    accommodationType: string;
    isConfirmed: boolean;
    createdAt: string;
}

interface Volunteer {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    skills: string[];
    status: "pending" | "approved" | "rejected";
    isConfirmed: boolean;
    createdAt: string;
}

export default function AdminDashboardPage() {
    const router = useRouter();
    const { user, isAuthenticated, logout, isLoading } = useAuth();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [activeTab, setActiveTab] = useState<"overview" | "registrations" | "volunteers">("overview");
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== "admin")) {
            router.push(ROUTES.LOGIN);
        }
    }, [isAuthenticated, isLoading, user, router]);

    const fetchDashboardData = async () => {
        try {
            setRefreshing(true);
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();

            if (data.success) {
                setStats(data.data.stats);
                setRegistrations(data.data.registrations);
                setVolunteers(data.data.volunteers);
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated && user?.role === "admin") {
            fetchDashboardData();

            // Auto-refresh every 30 seconds
            const interval = setInterval(fetchDashboardData, 30000);
            return () => clearInterval(interval);
        }
    }, [isAuthenticated, user]);

    const handleDeleteRegistration = async (id: string) => {
        if (!confirm("Are you sure you want to delete this registration?")) return;

        try {
            const response = await fetch(`/api/admin/registrations/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchDashboardData();
            }
        } catch (error) {
            console.error("Failed to delete registration:", error);
        }
    };

    const handleUpdateVolunteerStatus = async (id: string, status: "pending" | "approved" | "rejected") => {
        try {
            const response = await fetch(`/api/admin/volunteers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                fetchDashboardData();
            }
        } catch (error) {
            console.error("Failed to update volunteer status:", error);
        }
    };

    const handleDeleteVolunteer = async (id: string) => {
        if (!confirm("Are you sure you want to delete this volunteer?")) return;

        try {
            const response = await fetch(`/api/admin/volunteers/${id}`, {
                method: "DELETE",
            });

            if (response.ok) {
                fetchDashboardData();
            }
        } catch (error) {
            console.error("Failed to delete volunteer:", error);
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push(ROUTES.HOME);
    };

    if (isLoading || loading || !stats) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Registrations",
            value: stats.totalRegistrations,
            icon: Users,
            color: "from-blue-500 to-cyan-500",
            details: `${stats.confirmedRegistrations} confirmed, ${stats.pendingRegistrations} pending`,
        },
        {
            title: "Total Volunteers",
            value: stats.totalVolunteers,
            icon: UserCheck,
            color: "from-green-500 to-emerald-500",
            details: `${stats.approvedVolunteers} approved, ${stats.pendingVolunteers} pending`,
        },
        {
            title: "Confirmed Participants",
            value: stats.confirmedRegistrations,
            icon: CheckCircle,
            color: "from-purple-500 to-pink-500",
        },
        {
            title: "Pending Applications",
            value: stats.pendingRegistrations + stats.pendingVolunteers,
            icon: Clock,
            color: "from-orange-500 to-red-500",
        },
    ];

    return (
        <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
            <Header />

            <div className="container mx-auto px-4 py-24">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Real-time overview of registrations and volunteers
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={fetchDashboardData}
                            disabled={refreshing}
                        >
                            <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin" : ""}`} />
                        </Button>
                        <Button variant="outline" onClick={handleLogout}>
                            <LogOut className="w-4 h-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                            <stat.icon className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <div className="text-3xl font-bold mb-1">{stat.value}</div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.title}
                                    </div>
                                    {stat.details && (
                                        <div className="text-xs text-gray-500 mt-2">
                                            {stat.details}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-800">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "overview"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("registrations")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "registrations"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Registrations ({registrations.length})
                    </button>
                    <button
                        onClick={() => setActiveTab("volunteers")}
                        className={`px-4 py-2 font-medium transition-colors ${activeTab === "volunteers"
                                ? "text-green-600 border-b-2 border-green-600"
                                : "text-gray-600 hover:text-gray-900"
                            }`}
                    >
                        Volunteers ({volunteers.length})
                    </button>
                </div>

                {/* Content */}
                {activeTab === "overview" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Registrations</CardTitle>
                                <CardDescription>Latest 5 participant registrations</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {registrations.slice(0, 5).map((reg) => (
                                        <div key={reg._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <div>
                                                <div className="font-medium">{reg.firstName} {reg.lastName}</div>
                                                <div className="text-sm text-gray-600">{reg.email}</div>
                                            </div>
                                            <Badge variant={reg.isConfirmed ? "success" : "warning"}>
                                                {reg.isConfirmed ? "Confirmed" : "Pending"}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Volunteers</CardTitle>
                                <CardDescription>Latest 5 volunteer applications</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {volunteers.slice(0, 5).map((vol) => (
                                        <div key={vol._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                            <div>
                                                <div className="font-medium">{vol.firstName} {vol.lastName}</div>
                                                <div className="text-sm text-gray-600">{vol.email}</div>
                                            </div>
                                            <Badge
                                                variant={
                                                    vol.status === "approved"
                                                        ? "success"
                                                        : vol.status === "rejected"
                                                            ? "destructive"
                                                            : "warning"
                                                }
                                            >
                                                {vol.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === "registrations" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Registrations</CardTitle>
                            <CardDescription>Manage participant registrations</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800">
                                            <th className="text-left p-3">Name</th>
                                            <th className="text-left p-3">Email</th>
                                            <th className="text-left p-3">Phone</th>
                                            <th className="text-left p-3">Camp Date</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {registrations.map((reg) => (
                                            <tr key={reg._id} className="border-b border-gray-100 dark:border-gray-900">
                                                <td className="p-3">{reg.firstName} {reg.lastName}</td>
                                                <td className="p-3">{reg.email}</td>
                                                <td className="p-3">{reg.phone}</td>
                                                <td className="p-3">{reg.campDate}</td>
                                                <td className="p-3">
                                                    <Badge variant={reg.isConfirmed ? "success" : "warning"}>
                                                        {reg.isConfirmed ? "Confirmed" : "Pending"}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleDeleteRegistration(reg._id)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === "volunteers" && (
                    <Card>
                        <CardHeader>
                            <CardTitle>All Volunteers</CardTitle>
                            <CardDescription>Manage volunteer applications</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-gray-200 dark:border-gray-800">
                                            <th className="text-left p-3">Name</th>
                                            <th className="text-left p-3">Email</th>
                                            <th className="text-left p-3">Phone</th>
                                            <th className="text-left p-3">Skills</th>
                                            <th className="text-left p-3">Status</th>
                                            <th className="text-left p-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {volunteers.map((vol) => (
                                            <tr key={vol._id} className="border-b border-gray-100 dark:border-gray-900">
                                                <td className="p-3">{vol.firstName} {vol.lastName}</td>
                                                <td className="p-3">{vol.email}</td>
                                                <td className="p-3">{vol.phone}</td>
                                                <td className="p-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {vol.skills.slice(0, 2).map((skill, i) => (
                                                            <Badge key={i} variant="outline" className="text-xs">
                                                                {skill}
                                                            </Badge>
                                                        ))}
                                                        {vol.skills.length > 2 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{vol.skills.length - 2}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="p-3">
                                                    <Badge
                                                        variant={
                                                            vol.status === "approved"
                                                                ? "success"
                                                                : vol.status === "rejected"
                                                                    ? "destructive"
                                                                    : "warning"
                                                        }
                                                    >
                                                        {vol.status}
                                                    </Badge>
                                                </td>
                                                <td className="p-3">
                                                    <div className="flex gap-1">
                                                        {vol.status !== "approved" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUpdateVolunteerStatus(vol._id, "approved")}
                                                                title="Approve"
                                                            >
                                                                <CheckCircle className="w-4 h-4 text-green-600" />
                                                            </Button>
                                                        )}
                                                        {vol.status !== "rejected" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleUpdateVolunteerStatus(vol._id, "rejected")}
                                                                title="Reject"
                                                            >
                                                                <XCircle className="w-4 h-4 text-red-600" />
                                                            </Button>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handleDeleteVolunteer(vol._id)}
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Footer />
        </main>
    );
}
