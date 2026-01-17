"use client";

import { useState } from "react";
import { Upload, Music, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export default function AudioPage() {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        speaker: "",
        date: "",
    });
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!audioFile) return;

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", audioFile);
            uploadFormData.append("folder", "audio/messages");

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                alert("Audio message uploaded successfully!");
                setFormData({ title: "", description: "", speaker: "", date: "" });
                setAudioFile(null);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload audio");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Audio Messages</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload and manage audio messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Audio Message</CardTitle>
                        <CardDescription>Add new audio content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Message Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <Input
                                label="Speaker Name"
                                value={formData.speaker}
                                onChange={(e) => setFormData({ ...formData, speaker: e.target.value })}
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Audio File</label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                    required
                                />
                            </div>

                            <Button type="submit" disabled={uploading} className="w-full" size="lg">
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Audio
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Audio Messages</CardTitle>
                        <CardDescription>Latest uploaded audio</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-gray-500 py-12">
                            <Music className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No audio messages uploaded yet</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
