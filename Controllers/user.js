import { UserModel } from "../Models/user.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { uploadOnCloudinary } from "../Utilities/Cloudinary.js";

// Create new account 
export const signUp = async (req, res) => {
    const { FullName, emailID, password } = req.body;
    try {
        // Input Validation
        if (!FullName) {
            return res.json({
                success: false,
                message: 'Full Name of User is Required',
            });
        }

        if (!emailID) {
            return res.json({
                success: false,
                message: 'Email ID of User is Required',
            });
        }

        if (!password) {
            return res.json({
                success: false,
                message: 'Password of User is Required',
            });
        }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ emailID });
        if (existingUser) {
            return res.json({
                success: false,
                message: 'Email ID already in use',
            });
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and Save New User
        const newUser = new UserModel({ FullName, emailID, password: hashedPassword });
        await newUser.save();

        return res.json({
            success: true,
            message: 'Account Created Successfully',
            user: newUser,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Login account 
export const login = async (req, res) => {
    const { emailID, password } = req.body;
    try {
        const user = await UserModel.findOne({ emailID });

        if (!user) {
            return res.json({
                success: false,
                message: 'User Doesn’t Exist',
            });
        }

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.json({
                success: false,
                message: 'Invalid Password'
            });
        }

        const token = jwt.sign({ emailID: user.emailID }, 'nka1234');

        return res.json({
            success: true,
            message: 'Login Successfully',
            token,
            user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

// Update user profile 
export const updateUserProfile = async (req, res) => {
    const { FullName, address1, address2, gender, birthDay, phone } = req.body;
    const photo = req.file; // Correctly access the uploaded file
   

    // Input Validation
    if (!FullName) {
        return res.json({
            success: false,
            message: 'Full Name is Required'
        });
    }
    if (!address1) {
        return res.json({
            success: false,
            message: 'Address 1 is Required'
        });
    }
    if (!gender) {
        return res.json({
            success: false,
            message: 'Gender is Required'
        });
    }
    if (!birthDay) {
        return res.json({
            success: false,
            message: 'Birthday is Required'
        });
    }
    if (!phone) {
        return res.json({
            success: false,
            message: 'Phone Number is Required'
        });
    }

    try {
        let photoResponse = null;
        // Handle photo upload
        if (photo) {
            photoResponse = await uploadOnCloudinary(photo.buffer, photo.originalname);
        }

        // Prepare update data
        const updateData = {
            FullName,
            address1,
            address2,
            gender,
            birthDay,
            phone,
            ...(photoResponse && { photo: photoResponse.secure_url }) // Only add photo if it was uploaded
        };

        // Update the user in the database
        const response = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!response) {
            return res.json({
                success: false,
                message: 'User not found or update failed'
            });
        }
           console.log(response)
        return res.json({
            success: true,
            message: 'User profile updated successfully',
            user: response // Send back the updated user
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};
