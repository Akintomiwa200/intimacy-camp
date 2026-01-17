"use client";

import { useState } from "react";
import { Upload, Video, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export default function MediaPage() {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "short",
    });
    const [mediaFile, setMediaFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!mediaFile) return;

        setUploading(true);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", mediaFile);
            uploadFormData.append("folder", `media/${formData.type}s`);

            const response = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await response.json();
            if (data.success) {
                alert("Media uploaded successfully!");
                setFormData({ title: "", description: "", type: "short" });
                setMediaFile(null);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload media");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Media & Clips</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload shorts, clips, and reels
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Upload Media</CardTitle>
                        <CardDescription>Upload short videos, clips, or reels</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) =>
                                        setFormData({ ...formData, description: e.target.value })
                                    }
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Type</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="short">Short</option>
                                    <option value="clip">Clip</option>
                                    <option value="reel">Reel</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Video File</label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setMediaFile(e.target.files?.[0] || null)}
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
                                        Upload Media
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Media</CardTitle>
                        <CardDescription>Latest uploaded media</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-gray-500 py-12">
                            <Video className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No media uploaded yet</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
