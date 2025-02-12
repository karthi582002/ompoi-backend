import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "pdf_uploads", // The folder in Cloudinary
        format: async (req, file) => "pdf", // Enforce PDF format
        resource_type: "raw" // Use 'raw' for non-image files like PDFs
    },
});

const image_storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        const isVideo = file.mimetype.startsWith("video/"); // Check if file is a video
        return {
            folder: "Products_Resources",
            allowed_formats: ["jpg", "jpeg", "png", "mp4", "webp", "mov"],
            resource_type: isVideo ? "video" : "image", // Set 'video' for videos, 'image' for images
            transformation: isVideo
                ? [{ width: 720, height: 1280, crop: "limit" }] // Video transformations
                : [{ width: 500, height: 500, crop: "limit" }], // Image transformations
        };
    },
});

// const product_storage =


export const upload = multer({ storage });
export const uploadProducts = multer({ storage :image_storage });