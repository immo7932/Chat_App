import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dfmkcktpm',
    api_key: '994919585493649',
    api_secret: 'RxXG_lDLZhdRddQ4CELDHdzqx6Y'
});

const upload_image = async (pics, retries = 3) => {
    try {
        if (!pics) {
            throw new Error("No file path provided");
        }

        const uploadResult = await cloudinary.uploader.upload(pics, {
            resource_type: "auto",
            timeout: 60000 // set a timeout of 60 seconds
        });

        return uploadResult.url;
    } catch (error) {
        if (retries > 0) {
            console.warn(`Retrying upload... (${retries} retries left)`);
            return upload_image(pics, retries - 1);
        } else {
            console.error("Cloudinary upload error:", error);
            throw new Error("Failed to upload image to Cloudinary");
        }
    }
};

export default upload_image;
