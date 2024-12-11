import expess from 'express';
import { isAuthenticated } from '../Utilities/user.js';
import { upload } from '../Utilities/multer.js';
import { AddDoctor, changeDoctorAvailablity, getAllDoctors, getSingleDoctor, loginDoctor, relatedDoctors, updateDoctorProfile } from '../Controllers/doctor.js';
const Router = expess.Router();




Router.post('/add-doctor',upload.single('photo'),AddDoctor);
Router.post('/login-doctor',loginDoctor);
Router.get('/get-all-doctors',getAllDoctors);
Router.get('/get-single-doctor_:id',getSingleDoctor);
Router.get('/get-related-doctors/:speciality',relatedDoctors)
Router.put('/update-doctor-availablity/:id',changeDoctorAvailablity);
Router.put('/update-doctor-profile/:id',updateDoctorProfile);






export const DoctorRouter =Router;