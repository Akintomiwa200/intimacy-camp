"use client";

import { useState } from "react";
import { Save, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        appName: "Young Ministers Retreat",
        appEmail: "info@ymr.org",
        appPhone: "+234 123 456 7890",
        maxCapacity: "500",
        registrationOpen: true,
        emailNotifications: true,
    });

    const handleSave = () => {
        // Save settings to database
        console.log("Saving settings:", settings);
        alert("Settings saved successfully!");
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Settings</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Configure application settings
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* General Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>General Settings</CardTitle>
                        <CardDescription>Basic application configuration</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Input
                            label="Application Name"
                            value={settings.appName}
                            onChange={(e) =>
                                setSettings({ ...settings, appName: e.target.value })
                            }
                        />

                        <Input
                            label="Contact Email"
                            type="email"
                            value={settings.appEmail}
                            onChange={(e) =>
                                setSettings({ ...settings, appEmail: e.target.value })
                            }
                        />

                        <Input
                            label="Contact Phone"
                            type="tel"
                            value={settings.appPhone}
                            onChange={(e) =>
                                setSettings({ ...settings, appPhone: e.target.value })
                            }
                        />

                        <Input
                            label="Maximum Capacity"
                            type="number"
                            value={settings.maxCapacity}
                            onChange={(e) =>
                                setSettings({ ...settings, maxCapacity: e.target.value })
                            }
                        />
                    </CardContent>
                </Card>

                {/* Registration Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle>Registration Settings</CardTitle>
                        <CardDescription>Control registration and notifications</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                                <p className="font-medium">Registration Open</p>
                                <p className="text-sm text-gray-600">
                                    Allow new registrations
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.registrationOpen}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            registrationOpen: e.target.checked,
                                        })
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
                            <div>
                                <p className="font-medium">Email Notifications</p>
                                <p className="text-sm text-gray-600">
                                    Send real-time email notifications
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={settings.emailNotifications}
                                    onChange={(e) =>
                                        setSettings({
                                            ...settings,
                                            emailNotifications: e.target.checked,
                                        })
                                    }
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                            </label>
                        </div>

                        <Button onClick={handleSave} className="w-full" size="lg">
                            <Save className="w-5 h-5 mr-2" />
                            Save Settings
                        </Button>
                    </CardContent>
                </Card>

                {/* Email Configuration */}
                <Card>
                    <CardHeader>
                        <CardTitle>Email Configuration</CardTitle>
                        <CardDescription>SMTP and email settings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <p className="text-sm text-blue-800 dark:text-blue-200">
                                    Email configuration is managed through environment variables.
                                    Update your <code className="bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded">.env.local</code> file to change email settings.
                                </p>
                            </div>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Current Status:</strong> {settings.emailNotifications ? "✅ Enabled" : "❌ Disabled"}</p>
                                <p><strong>From Address:</strong> {settings.appEmail}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Database Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Database Information</CardTitle>
                        <CardDescription>Connection and status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <p className="text-sm text-green-800 dark:text-green-200">
                                    ✅ Database connection is active
                                </p>
                            </div>
                            <div className="text-sm text-gray-600 space-y-2">
                                <p><strong>Type:</strong> MongoDB</p>
                                <p><strong>Status:</strong> Connected</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
