import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
export const uploadCloudinary = async (filePath) => {
  // Configuration
  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET, // Click    });   });'View API Keys' above to copy your API secret
  });
  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath);
    return uploadResult.secure_url;
  } catch (error) {
    fs.unlinkSync(filePath);
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};
