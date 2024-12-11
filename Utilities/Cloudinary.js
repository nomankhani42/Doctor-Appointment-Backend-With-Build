import { v2 as cloudinary } from 'cloudinary';


    
    cloudinary.config({ 
        cloud_name: 'dimjv8tuc', 
        api_key: 876594164557154 ,
        api_secret:'b9DGn3aCVOZjomIn_mswIYWnxrk' 
    });

    
    export const uploadOnCloudinary=async(localFilePath)=>{
       try {
          if(!localFilePath) return null;
          const response=await cloudinary.uploader.upload(localFilePath,{
            resource_type:'auto'
          })

           return response;
       } 
       catch (error) {
         console.log(error)
       }
    }
