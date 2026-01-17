"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, Plus, Loader2 } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";

export default function SermonsPage() {
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        speaker: "",
        date: "",
        category: "sermon",
    });
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [audioFile, setAudioFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let videoUrl = "";
            let audioUrl = "";

            // Upload video if provided
            if (videoFile) {
                const videoFormData = new FormData();
                videoFormData.append("file", videoFile);
                videoFormData.append("folder", "sermons/videos");

                const videoResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: videoFormData,
                });

                const videoData = await videoResponse.json();
                if (videoData.success) {
                    videoUrl = videoData.data.url;
                }
            }

            // Upload audio if provided
            if (audioFile) {
                const audioFormData = new FormData();
                audioFormData.append("file", audioFile);
                audioFormData.append("folder", "sermons/audio");

                const audioResponse = await fetch("/api/upload", {
                    method: "POST",
                    body: audioFormData,
                });

                const audioData = await audioResponse.json();
                if (audioData.success) {
                    audioUrl = audioData.data.url;
                }
            }

            // Create sermon record (API route to be created)
            const sermonData = {
                ...formData,
                videoUrl,
                audioUrl,
            };

            console.log("Sermon data:", sermonData);
            alert("Sermon uploaded successfully!");

            // Reset form
            setFormData({
                title: "",
                description: "",
                speaker: "",
                date: "",
                category: "sermon",
            });
            setVideoFile(null);
            setAudioFile(null);
        } catch (error) {
            console.error("Upload error:", error);
            alert("Failed to upload sermon");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Sermons Management</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Upload and manage sermon videos and audio messages
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Upload Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Upload New Sermon</CardTitle>
                        <CardDescription>Add video or audio sermon content</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label="Sermon Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
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
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                    required
                                />
                            </div>

                            <Input
                                label="Speaker Name"
                                value={formData.speaker}
                                onChange={(e) =>
                                    setFormData({ ...formData, speaker: e.target.value })
                                }
                                required
                            />

                            <Input
                                label="Date"
                                type="date"
                                value={formData.date}
                                onChange={(e) =>
                                    setFormData({ ...formData, date: e.target.value })
                                }
                                required
                            />

                            <div>
                                <label className="block text-sm font-medium mb-2">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) =>
                                        setFormData({ ...formData, category: e.target.value })
                                    }
                                    className="w-full h-11 px-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500"
                                >
                                    <option value="sermon">Sermon</option>
                                    <option value="teaching">Teaching</option>
                                    <option value="worship">Worship</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Video File (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Audio File (Optional)
                                </label>
                                <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                                    className="w-full"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={uploading}
                                className="w-full"
                                size="lg"
                            >
                                {uploading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="w-5 h-5 mr-2" />
                                        Upload Sermon
                                    </>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Recent Sermons */}
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Sermons</CardTitle>
                        <CardDescription>Latest uploaded sermons</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center text-gray-500 py-12">
                            <Upload className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No sermons uploaded yet</p>
                            <p className="text-sm mt-2">Upload your first sermon to get started</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
