import jwt from 'jsonwebtoken'
import { UserModel } from '../Models/user.js';

export const isAuthenticated=async(req,res,next)=>{
      const decode =await jwt.verify(req.headers.authorization,'nka1234');
      req.user=decode;
      res.json({
              success:true,
              message:'user is authenticated'
      })
     return next();
}


export const checkDoctor=async(req,res,next)=>{
      try {
            const doctor = await UserModel.findOne({
                  emailID:req.user.emailID
            }).select('-password');

            if(doctor.role!=='doctor'){
                  return res.json({
                        success:true,
                        message:'Sorry You Are Not Authorised As Doctor',
                       
                       })  
            }
          return  res.json({
            success:true,
            message:'You Are Authorised As Doctor',
            doctor
           })  

           
      }
       catch (error) {
            
      }
}

export const checkAdmin=async(req,res,next)=>{
      try {
            const admin = await UserModel.findOne({
                  emailID:req.user.emailID
            }).select('-password');

            if(admin.role!=='admin'){
                  return res.json({
                        success:true,
                        message:'Sorry You Are Not Authorised As Admin',
                       
                       })  
            }
          return  res.json({
            success:true,
            message:'You Are Authorised As Admin',
            admin
           })  

           
      }
       catch (error) {
            
      }
}