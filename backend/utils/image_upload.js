import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dfmkcktpm',
    api_key: '994919585493649',
    api_secret: 'RxXG_lDLZhdRddQ4CELDHdzqx6Y'
});

const upload_image = async (pics) => {
    try {
        if (!pics) {
            throw new Error("No file path provided");
        }

        const uploadResult = await cloudinary.uploader.upload(pics, {
            resource_type: "auto"
        });

        return uploadResult.url;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image to Cloudinary");
    }
};

export default upload_image;