import express from 'express';
import { login, signUp, updateUserProfile } from '../Controllers/user.js';
import { checkAdmin, checkDoctor, isAuthenticated } from '../Utilities/user.js';
import { upload } from '../Utilities/multer.js';
const Router=express.Router();


Router.post('/new-user',signUp);
Router.post('/login',login);
// this is for checking authentication 
Router.get('/check-authentication',isAuthenticated);
// this is for checking admin 
Router.get('/check-admin',isAuthenticated,checkAdmin);
// this is for checking doctor 
Router.get('/check-doctor',isAuthenticated,checkDoctor)
Router.put('/update-user-profile/:id',upload.single('photo'),updateUserProfile)







export const userRouter=Router;