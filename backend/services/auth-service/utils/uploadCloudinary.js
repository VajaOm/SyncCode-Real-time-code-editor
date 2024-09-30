import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
import fs from 'fs';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localfilepath, foldername) => {
    try {
        if (!localfilepath) {
            throw new Error("Local file path is empty or undefined");
        }

        const response = await cloudinary.v2.uploader.upload(localfilepath, {
            resource_type: "auto",
            folder: foldername
        });

        if (response && response.url) {
            console.log("File uploaded successfully:", response.url);

            // Delete the local file after a successful upload
            fs.unlinkSync(localfilepath);

            return response;
        } else {
            throw new Error("Cloudinary upload failed or response missing URL");
        }
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);

        // Remove locally saved file if the upload operation fails
        fs.unlinkSync(localfilepath);

        return null;
    }
};

export { uploadOnCloudinary };