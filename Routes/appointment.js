import express from 'express';
import { BookAppointment, getAllAppointments, getPatientAppointments,cancelAppointment, getDoctorAppointments, completeAppointment, payAppointmentFeeOnline, confirmAppointmentPayment } from '../Controllers/appointment.js';

const Router=express.Router();


Router.post('/book-appointment',BookAppointment);
Router.get('/get-patient-appointment/:id',getPatientAppointments)
Router.get('/get-doctor-appointments/:id',getDoctorAppointments);
Router.get('/get-all-appointments',getAllAppointments);
Router.put('/cencel-appointment/:id',cancelAppointment);
Router.put('/complete-appointment/:id',completeAppointment);
Router.post('/make-appointment-payment',payAppointmentFeeOnline);
Router.put('/confirm-payment/:id',confirmAppointmentPayment)





export const AppointmentRouter=Router;