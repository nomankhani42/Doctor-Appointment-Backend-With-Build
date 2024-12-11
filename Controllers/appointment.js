import { AppointmentModel } from "../Models/appointment.js";
import StripePackage from 'stripe';

const stripe=new StripePackage('sk_test_51PlqUxBdG0truyJNzu7ra5ysG0KMEs3FMytB0STu1jtJIU0qftkp4211y3lVEqYF6c8Z79rBScZgMU5rs1PiTVkH00EBRPUzdi')

export const BookAppointment = async (req, res) => {
  const {
    patient,
    department,
    doctor,
    dateTime,
    fee,

  } = req.body;

  try {
    // Input validation
    if (!patient || !patient.name || !patient.id || !patient.age || !patient.photo) {
      return res.status(400).json({
        success: false,
        message: "Patient details are required."
      });
    }

    if (!department) {
      return res.status(400).json({
        success: false,
        message: "Department is required."
      });
    }

    if (!doctor || !doctor.name || !doctor.id || !doctor.photo) {
      return res.status(400).json({
        success: false,
        message: "Doctor details are required."
      });
    }

    if (!dateTime) {
      return res.status(400).json({
        success: false,
        message: "Date and time are required."
      });
    }

    if (fee === undefined || fee < 0) {
      return res.status(400).json({
        success: false,
        message: "A valid fee is required."
      });
    }



    // Create a new appointment
    const newAppointment = new AppointmentModel({
      patient,
      department,
      doctor,
      dateTime,
      fee,

    });

    // Save the appointment to the database
    const savedAppointment = await newAppointment.save();

    // Respond with the created appointment
    return res.status(201).json(
      {
        success: true,
        message: 'Appointment Booked Successfully',
        savedAppointment

      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const getPatientAppointments = async (req, res) => {
  try {
    // Validate that the patient ID is provided
    const patientId = req.params.id; // Expecting a patient ID in the URL
    if (!patientId) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required.'
      });
    }

    // Fetch appointments for the specified patient
    const patientAppointments = await AppointmentModel.find({
      'patient.id': patientId // Querying based on the structure of the model
    });

    // Check if any appointments were found
    if (!patientAppointments || patientAppointments.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No appointments found for this patient.'
      });
    }

    // Return a successful response with the found appointments
    return res.status(200).json({
      success: true,
      message: 'Patient appointments fetched successfully.',
      patientAppointments
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    // Return a generic error message for any unexpected errors
    return res.status(500).json({
      success: false,
      message: 'An error occurred while fetching appointments. Please try again later.'
    });
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const AllAppointments = await AppointmentModel.find({});

    return res.json({
      success: true,
      message: 'All Appointments Fetched Successfully',
      AllAppointments
    })
  } catch (error) {
    console.log(error)
  }
}

export const cancelAppointment = async (req, res) => {
  try {
    // Validate that the request body contains an ID
    if (!req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required.',
      });
    }

    // Find the appointment by ID and update its status to 'cancelled'
    const appointment = await AppointmentModel.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true } // Return the updated document
    );

    // If no appointment is found, return an error message
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found.',
      });
    }

    // Successfully cancelled the appointment
    return res.json({
      success: true,
      message: 'Appointment cancelled successfully.',
      appointment, // Send the updated appointment object back to the client
    });
  } catch (error) {
    console.error(error); // Log the error for debugging

    // Return a generic error message to the client
    return res.status(500).json({
      success: false,
      message: 'An error occurred while cancelling the appointment.',
    });
  }
};

export const getDoctorAppointments = async (req, res) => {
  const id=req.params.id;
 try {
    if(!id){
      return res.json({
         success:false,
         message:'doctor id is invalid'
      }) }
      const DoctorAppointments=await AppointmentModel.find({
        'doctor.id':id
    })

    if(!DoctorAppointments){
      return res.json({
         success:false,
         message:'Error in Getting Doctor Appointments'
      }) }

      return res.json({
          success:true,
          message:'Doctor Appointemts Fetched Successfully',
          DoctorAppointments
      })
 } 
 catch (error) {
     console.log(error)
 }
}



export const completeAppointment = async (req, res) => {
  const id = req.params.id;

  try {
   

    // Find and update the appointment status to 'completed'
    const completeAppointment = await AppointmentModel.findByIdAndUpdate(
      id,
      { status: 'completed' },
      { new: true } // Return the updated document
    );

   

    // Return success response with the updated appointment data
    return res.status(200).json({
      success: true,
      message: 'Appointment completed successfully',
      completeAppointment, // Return the updated appointment object
    });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.',
    });
  }
};

export const payAppointmentFeeOnline = async (req, res) => {
  const { payment, doctorDetail,Pid } = req.body;

  try {
    // Step 1: Validate the input
    if (!payment) {
      return res.json({
        success: false,
        message: 'Payment amount is required',
      });
    }

    if (!doctorDetail) {
      return res.json({
        success: false,
        message: 'Doctor Detail is required',
      });
    }

    // Step 2: Use dummy values for payment and doctor details (can replace these with actual data)
    const dummyPayment = payment || 1000;  // Default to 1000 cents ($10) if no payment amount is provided
    const dummyDoctorName = doctorDetail?.name || 'Dr. Dummy Name';  // Default doctor name
    const DummyAppointmentDateTime=doctorDetail.appointmentDateTime|| 'Dummy Time';
   



    // Step 3: Create Stripe Checkout session with dummy values
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'], // We are accepting card payments
      line_items: [
        {
          price_data: {
            currency: 'usd', // The currency for the payment
            product_data: {
              name: dummyDoctorName, // Display doctor name as product description
              
              
            },
            unit_amount: dummyPayment, // Amount in cents (e.g., 1000 cents = $10)
          },
          quantity: 1, // Number of units, you can modify if necessary
        },
      ],
      mode: 'payment', // One-time payment mode
      success_url: `http://localhost:5173/profile/my-appointments?payment=true&Pid=${Pid}`,  // Replace with a valid client URL
      cancel_url: `http://localhost:5173/profile/my-appointments?payment=false`, // Replace with a valid client URL
    });

    // Step 4: Send the session ID to the frontend
    return res.json({
      success: true,
      sessionId: session.id,
      url:session.url
    });
  } catch (error) {
    console.error('Error during Stripe payment session creation:', error);
    return res.json({
      success: false,
      message: 'An error occurred during payment processing.',
    });
  }
};



export const confirmAppointmentPayment=async(req,res)=>{
    const {id}=req.params;
       if(!id){
        return res.json({
          success:false,
          message:'Appointment id is required'
        })
       }
    const updatePaymentStatus=await AppointmentModel.findByIdAndUpdate(id,{payment:'online'},{new:true});

    return res.json({
         success:true,
         message:'Payment Confirmed Successfully',
         updatePaymentStatus
    })
}