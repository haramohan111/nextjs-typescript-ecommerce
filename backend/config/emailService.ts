import nodemailer from 'nodemailer';


const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends a verification email to the user.
 * @param email The recipient's email address.
 * @param verificationLink The verification link to be sent.
 */
export const sendVerificationEmail = async (email: string, verificationLink: string) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Email Verification',
      html: `
        <p>Hi,</p>
        <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
        <a href="${verificationLink}" target="_blank">Verify Email</a>
        <p>If you didn't create this account, you can safely ignore this email.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Verification email sent: ${info.messageId}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
