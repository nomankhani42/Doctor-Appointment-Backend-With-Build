import { DoctorModel } from "../Models/doctor.js";
import { uploadOnCloudinary } from "../Utilities/Cloudinary.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const AddDoctor = async (req, res) => {
    const { doctorName, email, education, password, address1, address2, experience, fees, about, speciality } = req.body;
    const photo = req.file;

    try {
        // Input Validation
        if (!doctorName) {
            return res.json({
                success: false,
                message: 'Doctor Name is Required',
            });
        }
        if (!email) {
            return res.json({
                success: false,
                message: 'Email ID is Required',
            });
        }

        if (!password) {
            return res.json({
                success: false,
                message: 'Password is Required',
            });
        }
        if (password.length < 6) { // Minimum password length
            return res.json({
                success: false,
                message: 'Password must be at least 6 characters long',
            });
        }
        if (!fees) {
            return res.json({
                success: false,
                message: 'Fees is Required',
            });
        }
        if (isNaN(fees) || fees <= 0) { // Fees should be a positive number
            return res.json({
                success: false,
                message: 'Fees must be a positive number',
            });
        }
        if (!speciality) {
            return res.json({
                success: false,
                message: 'Speciality is Required',
            });
        }
        if (!experience) {
            return res.json({
                success: false,
                message: 'Experience is Required',
            });
        }
        if (!education) {
            return res.json({
                success: false,
                message: 'Education is Required',
            });
        }
        if (!about) {
            return res.json({
                success: false,
                message: 'About is Required',
            });
        }

        // Check if email already exists
        const existingDoctor = await DoctorModel.findOne({ email });
        if (existingDoctor) {
            return res.json({
                success: false,
                message: 'Email ID already in use',
            });
        }

        // Handle photo upload if provided
        let cloudinaryResponse = null;

        if (photo) {
            const photoPath = photo.path;
            cloudinaryResponse = await uploadOnCloudinary(photoPath);
            if (!cloudinaryResponse) {
                return res.status(500).json({
                    success: false,
                    message: 'Error uploading photo to Cloudinary',
                });
            }
        }

        const hashPassword = await bcrypt.hash(password, 10);

        // Create and Save New Doctor
        const newDoctor = new DoctorModel({
            doctorName,
            email,
            education,
            password: hashPassword, // Hash password if necessary before saving
            address1,
            address2, // Keep address2 optional
            experience,
            fees,
            about,
            speciality,
            photo: cloudinaryResponse ? cloudinaryResponse.secure_url : null, // Set photo only if cloudinary upload was successful
        });

        await newDoctor.save();

        return res.json({
            success: true,
            message: 'Doctor Added Successfully',
            user: {
                id: newDoctor._id,
                doctorName: newDoctor.doctorName,
                email: newDoctor.email,
                speciality: newDoctor.speciality,
                photo: newDoctor.photo,
            },
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
        });
    }
};

export const loginDoctor = async (req, res) => {
    const { email, password } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: 'email is required'


        })
    };
    if (!password) {
        return res.json({
            success: false,
            message: 'email is required'


        }) };

        const doctor = await DoctorModel.findOne({ email });

        if (!doctor) {
            return res.json({
                success: false,
                message: 'This Email Doesnt Exist'
            })
        }

    //    check password  
      const matchPassword= await bcrypt.compare(password, doctor.password);

      if(!matchPassword){
        return res.json({
            success:false,
            message:'Password is incorrect'
        })  }

        const token=jwt.sign({email:doctor.email},'nka1234');

        return res.json({
               success:true,
               message:'Doctor Login Successfully',
               token,
               doctor
        })


}


export const getAllDoctors = async (req, res) => {
    try {
        const Doctors = await DoctorModel.find({});


        return res.json({
            success: true,
            message: 'Doctors Data Fetched Successfully',
            Doctors
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const getSingleDoctor = async (req, res) => {
    try {
        const doctor = await DoctorModel.findById(req.params.id).select('-password');
        if (!doctor) {
            return res.json({
                success: false,
                message: 'Invalid Doctor Id',

            })
        }
        return res.json({
            success: true,
            message: 'Single Doctor Data Fetched Successfully',
            doctor
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const relatedDoctors = async (req, res) => {
    try {
        const { speciality } = req.params;

        // Validate that speciality is provided
        if (!speciality) {
            return res.status(400).json({
                success: false,
                message: 'Speciality is required'
            });
        }

        // Fetch related doctors from the database
        const relatedDoctor = await DoctorModel.find({ speciality: speciality });

        // Check if any related doctors were found
        if (relatedDoctor.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No related doctors found for this speciality',
                relatedDoctor: []
            });
        }

        // Return the successful response
        return res.status(200).json({
            success: true,
            message: 'Related Doctors Fetched Successfully',
            relatedDoctor
        });
    } catch (error) {
        console.error(error); // Log the error for debugging

        // Return an error response
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message // Optionally return the error message for debugging (avoid in production)
        });
    }
};


export const changeDoctorAvailablity = async (req, res) => {
    try {
        const response = await DoctorModel.findByIdAndUpdate(req.params.id, { availablity: req.body.checked }, { new: true });

        return res.json({
            success: true,
            message: "Doctor Availablity Changed Successfully",
            response
        })
    }
    catch (error) {
        console.log(error)
    }
}

export const updateDoctorProfile = async (req, res) => {
    const id = req.params.id;
    const { doctorName, education, speciality, experience, about, fees, address1, address2, availability } = req.body;
  
    // Check required fields
    if (!doctorName) {
      return res.json({
        success: false,
        message: 'Doctor Name is Required',
      });
    }
  
    if (!fees) {
      return res.json({
        success: false,
        message: 'Fees is Required',
      });
    }
  
    if (isNaN(fees) || fees <= 0) { // Fees should be a positive number
      return res.json({
        success: false,
        message: 'Fees must be a positive number',
      });
    }
  
    if (!speciality) {
      return res.json({
        success: false,
        message: 'Speciality is Required',
      });
    }
  
    if (!experience) {
      return res.json({
        success: false,
        message: 'Experience is Required',
      });
    }
  
    if (!education) {
      return res.json({
        success: false,
        message: 'Education is Required',
      });
    }
  
    if (!about) {
      return res.json({
        success: false,
        message: 'About is Required',
      });
    }
  
    // All validation checks passed, proceed to update the doctor profile
    try {
      const updateDoctor = await DoctorModel.findByIdAndUpdate(id, { ...req.body }, { new: true });
  
      return res.json({
        success: true,
        message: 'User Profile Updated Successfully',
        updateDoctor
      });
    } catch (error) {
      return res.json({
        success: false,
        message: 'Error updating profile',
        error: error.message
      });
    }
  };
  
  

