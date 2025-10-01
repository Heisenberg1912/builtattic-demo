import nodemailer from 'nodemailer';

const createTransporter = () => {
  const transporter = nodemailer.createTransporter({
    service: 'gmail', // You can change this to your preferred email service
    auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_PASS, // Your email password or app password
    },
  });

  return transporter;
};

export default createTransporter;