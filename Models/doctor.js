import mongoose, { model, Schema } from 'mongoose';

const DoctorSchema = new Schema({
    doctorName: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: true, // Ensuring that email is unique
     
    },
    education: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
       
    },
    address1: {
        type: String,
        required: true
    },
    address2: {
        type: String,
        // Optional field - no need to specify
    },
    experience: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true,
        min: 0 // Fees must be a positive number
    },
    about: {
        type: String,
        maxlength: 500,
        required: true
    },
    speciality: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true
    },
    availablity:{
        type:Boolean,
        default:true
    }
}, { timestamps: true }); // Automatically add createdAt and updatedAt timestamps

export const DoctorModel = model('Doctor', DoctorSchema); // Model name should be capitalized
