import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

// Cloudinary configuration
cloudinary.config({ 
  cloud_name: 'dimjv8tuc', 
  api_key: '876594164557154',
  api_secret: 'b9DGn3aCVOZjomIn_mswIYWnxrk' 
});

// Function to upload a file buffer to Cloudinary
export const uploadOnCloudinary = async (fileBuffer, fileName) => {
  try {
    if (!fileBuffer) return null;

    // Create a readable stream from the file buffer
    const stream = Readable.from(fileBuffer);

    // Upload the file to Cloudinary using upload_stream
    const response = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          resource_type: 'auto',  // Automatically detect the file type (image, video, etc.)
          public_id: fileName     // Optional: Set a specific public_id or let Cloudinary generate one
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Pipe the buffer stream to Cloudinary upload stream
      stream.pipe(uploadStream);
    });

    return response;
  } catch (error) {
    console.log('Error uploading file to Cloudinary:', error);
    return null;
  }
};
