import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.APP_PASSWORD,
  },
  connectionTimeout: 10000,
  greetingTimeout: 10000,
  socketTimeout: 10000,
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Server Ready");
  }
});

export const sendOtpMail = async (to, otp) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to,
      subject: "Reset Your Password",
      html: `
        <p>Your OTP for password reset is <strong>${otp}</strong>.</p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log("Password OTP Mail Sent:", info.messageId);

    return info;
  } catch (error) {
    console.error("sendOtpMail Error:", error);
    throw error;
  }
};

export const sendDeliveryOtpMail = async (user, otp) => {
  try {
    if (!user?.email) {
      throw new Error("User email not found");
    }

    const info = await transporter.sendMail({
      from: process.env.EMAIL,
      to: user.email,
      subject: "Delivery OTP",
      html: `
        <p>Your delivery OTP is <strong>${otp}</strong>.</p>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    console.log(
      `Delivery OTP Mail Sent to ${user.email}:`,
      info.messageId
    );

    return info;
  } catch (error) {
    console.error("sendDeliveryOtpMail Error:", error);
    throw error;
  }
};
