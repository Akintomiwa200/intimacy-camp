import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

/**
 * Upload file to Cloudinary
 */
export async function uploadToCloudinary(
    file: File | string,
    folder: string = "ymr"
): Promise<{ url: string; publicId: string }> {
    try {
        let fileData: string;

        if (typeof file === "string") {
            fileData = file;
        } else {
            // Convert File to base64
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            fileData = `data:${file.type};base64,${buffer.toString("base64")}`;
        }

        const result = await cloudinary.uploader.upload(fileData, {
            folder,
            resource_type: "auto",
        });

        return {
            url: result.secure_url,
            publicId: result.public_id,
        };
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload file");
    }
}

/**
 * Delete file from Cloudinary
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Cloudinary delete error:", error);
        throw new Error("Failed to delete file");
    }
}
