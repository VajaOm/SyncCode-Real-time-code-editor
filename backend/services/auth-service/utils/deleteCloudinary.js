import dotenv from 'dotenv';
import cloudinary from 'cloudinary';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const deleteFromCloudinary = async (publicId) => {
    try {

        const response = await cloudinary.v2.uploader.destroy(publicId, {
            resource_type: "image"
        });

        console.log("Cloudinary Response:", response);
    
    } catch (error) {
        console.error("Error deleting file from Cloudinary:", error);
    }
};

export { deleteFromCloudinary };