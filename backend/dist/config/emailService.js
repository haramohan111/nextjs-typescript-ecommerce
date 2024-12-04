"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendVerificationEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
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
const sendVerificationEmail = (email, verificationLink) => __awaiter(void 0, void 0, void 0, function* () {
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
        const info = yield transporter.sendMail(mailOptions);
        console.log(`Verification email sent: ${info.messageId}`);
    }
    catch (error) {
        console.error('Error sending email:', error);
    }
});
exports.sendVerificationEmail = sendVerificationEmail;
