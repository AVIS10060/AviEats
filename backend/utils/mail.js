import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create a transporter using Ethereal test credentials.
// For production, replace with your actual SMTP server details.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  secure: true, // Use true for port 465, false for port 587
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
});


export const sendOtpMail =  async (to,otp) =>{
    await transporter.sendMail({
    from: process.env.EMAIL,
    to,
    subject: "Reset your Password",
    html: `<p>Your Otp for password reset is ${otp} .This otp is valid for 5 minutes .</p>`, // HTML version of the message
  })


}