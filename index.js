import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './Routes/user.js';
import { DoctorRouter } from './Routes/doctor.js';
import { AppointmentRouter } from './Routes/appointment.js';
import dotenv from 'dotenv';
import cors from 'cors';







dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://webdevelopernoman:1Cz4gJtEKlCxQ7Pc@cluster0.hcxeo.mongodb.net/');
  console.log('DB Connected')

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// routes api endpoints 

app.use('/api/v1',userRouter)
app.use('/api/v1/doctor',DoctorRouter);
app.use('/api/v1/appointment',AppointmentRouter);













app.listen(8080,()=>{
    console.log('Server is Running')
})













