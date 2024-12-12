import express from 'express';
import mongoose from 'mongoose';
import { userRouter } from './Routes/user.js';
import { DoctorRouter } from './Routes/doctor.js';
import { AppointmentRouter } from './Routes/appointment.js';
import dotenv from 'dotenv';
import cors from 'cors';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory






dotenv.config();
const app=express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname,'./dist')))



main().catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.mongo_Url);
  console.log('DB Connected')

  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


// routes api endpoints 

app.use('/api/v1',userRouter)
app.use('/api/v1/doctor',DoctorRouter);
app.use('/api/v1/appointment',AppointmentRouter);
app.use('*',(req,res)=>{
  res.sendFile(path.join(__dirname, '/dist', 'index.html'));
})













app.listen(8080,()=>{
    console.log('Server is Running')
})













