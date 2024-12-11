import mongoose, { model, Schema } from 'mongoose';

// Appointment Schema
const AppointmentSchema = new Schema({
    patient: {
        name: {
            type: String,
            required: true,
           
        },
        id:{
         type:String,
         required:true
        },

        age: {
            type: Number,
            required: true,
            min: 0
        },
        photo: {
            type: String,
            required: true
        }
       
    },
    department: {
       
            type: String,
            required: true
        
    },
    doctor: {
        name: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 50
        },
        id: {
            type: Schema.Types.ObjectId,
            required: true
        },
       
        photo: {
            type: String,
            required: true
        }
    },
    dateTime: {
        type: String,
        required: true
    },
    fee: {
        type: Number,
        required: true,
        min: 0
    },
    status: {
        type: String,
        enum: ['pending','cancelled', 'completed'],
        default: 'pending'
    },
    payment: {
        type: String,
        enum: ['cash', 'online'],
        default:'cash'
    }
}, { timestamps: true });

export const AppointmentModel = model('Appointment', AppointmentSchema);
