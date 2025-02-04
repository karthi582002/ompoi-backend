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



export const upload = multer({ storage });
