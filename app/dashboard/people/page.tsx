"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, UserCheck, Clock, RefreshCw, Search, Filter } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";

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

export default function PeoplePage() {
    const [registrations, setRegistrations] = useState<Registration[]>([]);
    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<"all" | "confirmed" | "pending">("all");
    const [searchQuery, setSearchQuery] = useState("");

    const fetchData = async () => {
        try {
            const response = await fetch("/api/admin/dashboard");
            const data = await response.json();

            if (data.success) {
                setRegistrations(data.data.registrations);
                setVolunteers(data.data.volunteers);
            }
        } catch (error) {
            console.error("Failed to fetch data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const filteredRegistrations = registrations.filter((reg) => {
        const matchesFilter =
            filter === "all" ||
            (filter === "confirmed" && reg.isConfirmed) ||
            (filter === "pending" && !reg.isConfirmed);

        const matchesSearch =
            searchQuery === "" ||
            reg.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            reg.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesFilter && matchesSearch;
    });

    const filteredVolunteers = volunteers.filter((vol) => {
        const matchesSearch =
            searchQuery === "" ||
            vol.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vol.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vol.email.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Loading people data...</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">People Management</h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View and manage all registrations and volunteers
                    </p>
                </div>
                <Button onClick={fetchData} variant="outline">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Refresh
                </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Registrations</p>
                                <p className="text-3xl font-bold">{registrations.length}</p>
                            </div>
                            <Users className="w-10 h-10 text-blue-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Confirmed</p>
                                <p className="text-3xl font-bold">
                                    {registrations.filter((r) => r.isConfirmed).length}
                                </p>
                            </div>
                            <UserCheck className="w-10 h-10 text-green-600" />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Volunteers</p>
                                <p className="text-3xl font-bold">{volunteers.length}</p>
                            </div>
                            <Clock className="w-10 h-10 text-purple-600" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Filters and Search */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "confirmed" ? "default" : "outline"}
                        onClick={() => setFilter("confirmed")}
                    >
                        Confirmed
                    </Button>
                    <Button
                        variant={filter === "pending" ? "default" : "outline"}
                        onClick={() => setFilter("pending")}
                    >
                        Pending
                    </Button>
                </div>
            </div>

            {/* Registrations Table */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Participant Registrations</CardTitle>
                    <CardDescription>
                        {filteredRegistrations.length} registration(s) found
                    </CardDescription>
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
                                    <th className="text-left p-3">Accommodation</th>
                                    <th className="text-left p-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.map((reg) => (
                                    <tr
                                        key={reg._id}
                                        className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900"
                                    >
                                        <td className="p-3 font-medium">
                                            {reg.firstName} {reg.lastName}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">{reg.email}</td>
                                        <td className="p-3 text-sm">{reg.phone}</td>
                                        <td className="p-3 text-sm">{reg.campDate}</td>
                                        <td className="p-3 text-sm capitalize">{reg.accommodationType}</td>
                                        <td className="p-3">
                                            <Badge variant={reg.isConfirmed ? "success" : "warning"}>
                                                {reg.isConfirmed ? "Confirmed" : "Pending"}
                                            </Badge>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            {/* Volunteers Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Volunteers</CardTitle>
                    <CardDescription>
                        {filteredVolunteers.length} volunteer(s) found
                    </CardDescription>
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
                                </tr>
                            </thead>
                            <tbody>
                                {filteredVolunteers.map((vol) => (
                                    <tr
                                        key={vol._id}
                                        className="border-b border-gray-100 dark:border-gray-900 hover:bg-gray-50 dark:hover:bg-gray-900"
                                    >
                                        <td className="p-3 font-medium">
                                            {vol.firstName} {vol.lastName}
                                        </td>
                                        <td className="p-3 text-sm text-gray-600">{vol.email}</td>
                                        <td className="p-3 text-sm">{vol.phone}</td>
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
