import { Request, Response } from 'express';
import session from 'express-session';
import mongoose from 'mongoose';
import userModel from "../models/userModel";
import asyncHandler from "express-async-handler";
import { hashPassword } from "../helpers/authHelper";
import { generateAccessToken, generateRefreshToken, generateVerifyUserToken } from "../utils/generateToken";
import Verify from '../models/verifyModel';
import { sendVerificationEmail } from '../config/emailService';
import jwt, { JwtPayload } from 'jsonwebtoken';
import VerificationToken from '../models/verificationTokenModel';


interface IUser {
    _id: mongoose.Types.ObjectId;
    firstName: string;
    lastName: string;
    mobileNo: string;
    password: string;
    status: number;
}

declare module 'express-session' {
    interface SessionData {
        user: string;
        userId: string;
        userIdg: string;
        userIdn: string;
        isadmin: string;
        isMobile: string;
        user_session_id: string;
    }
}

interface CustomJwtPayload extends JwtPayload {
    id: string;
    role?: string; // Add any additional fields as needed
}
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
export const registerUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { firstName, lastName, mobileNo, password } = req.body as IUser;
        const nam = firstName + " " + lastName;
        // const newPassword = await hashPassword(password);
        // Validation
        if (!firstName || !lastName || !mobileNo || !password) {
            res.status(400).json({ message: 'All fields are required' });
        }
        const mobilecheck = await userModel.findOne({ mobile: mobileNo });

        if (mobilecheck) {
            res.status(400).send({
                success: false,
                message: "User already exists"
            });
        } else {
            const user = await userModel.create({
                name: nam,
                mobile: mobileNo,
                password,
                status: 1
            });

            if (user) {
                if (emailRegex.test(mobileNo)) {
                    // If mobileNo is an email, create a verification token and store it in the database
                    const token = jwt.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' });  // Generate a JWT token
                    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

                    // Save the token in the database with an expiration date
                    const verificationToken = new VerificationToken({
                        user: user._id,
                        token,
                        expiresAt: new Date(Date.now() + 3600000)  // 1 hour from now
                    });

                    await verificationToken.save();

                    // Send verification email
                    await sendVerificationEmail(mobileNo, verificationLink);
                    res.status(200).send({
                        success: true,
                        message: "User added successfully, verification email sent",
                        user
                    });
                } else {
                    res.status(200).send({
                        success: true,
                        message: "User added successfully",
                        user
                    });
                }
            } else {
                res.status(400).send({
                    success: false,
                    message: "User not added"
                });
            }
        }
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
});



// Interface for User
interface ILUser {
    mobileNo: string;
    password: string;
}

interface IUser extends mongoose.Document {
    firstName: string;
    lastName: string;
    mobile: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    status: number;
    isAdmin?: boolean;
    name?: string;
    email?: string;
    matchPassword: (enteredPassword: string) => Promise<string>;
    // Include other necessary fields
}

export const loginUser = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mobileNo, password } = req.body as ILUser;
    const user = await userModel.findOne({ mobile: mobileNo }).select("-createdAt -updatedAt").exec() as IUser | null;

    if (!user) res.status(400).send({
        success: false,
        message: "User not found please SignUp"
    });
    // if (user) {
    //     const isMatch = await user.matchPassword(password);
    //     console.log('Password Match:', isMatch)
    // }
    if (user)
        //console.log("check",await user.matchPassword(password))
        if (user && await user.matchPassword(password) && user.status !== 0) {

            const accessToken = generateAccessToken(user._id.toString());
            const refreshToken = generateRefreshToken(user._id.toString());
            //res.cookie("accessToken", accessToken);

            if (user) {
                // Ensure _id is asserted to be a string
                // req.session.cookie.maxAge = 1000 * 60 * 60;
                const uid = user._id.toString();
                req.session.userId = uid;

                const user_session_id = "id" + Math.random().toString(16).slice(2)
                req.session.user_session_id = user_session_id;
                const userId = new mongoose.Types.ObjectId(user._id);

                let verifyuser;
                const verify = await Verify.findOne({ user_id: user._id });

                if (!verify) {
                    verifyuser = await Verify.create({ user_id: user._id, user_session_id: user_session_id });
                }
                const encryptedData = generateVerifyUserToken(user._id.toString());
                res.cookie('ucid', encryptedData, { maxAge: 24 * 60 * 1000, httpOnly: false });
                res.status(200).send({
                    success: true,
                    message: "User login successfully",
                    accessToken,
                    refreshToken,
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Invalid mobile or email and password"
            });
        }
});



// Endpoint to verify the email link


export const verifyEmail = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { token } = req.body;  // Get token from query parameter

        if (!token) {
            res.status(400).send({ message: 'Verification token is required' });
            return;
        }

        // Verify the token
        const decoded: any = jwt.verify(token as string, 'your-secret-key');
        const userId = decoded.userId;

        // Find the corresponding verification token
        const verificationToken = await VerificationToken.findOne({ user: userId, token });

        if (!verificationToken) {
            res.status(400).send({ message: 'Invalid or expired verification token' });
            return;
        }

        if (verificationToken.expiresAt < new Date()) {
            res.status(400).send({ message: 'Verification token has expired' });
            return;
        }

        // Find the user and mark them as verified
        const user = await userModel.findById(userId);
        if (user) {
            user.status = 2;  // Assuming status 2 means verified
            await user.save();
            await VerificationToken.deleteOne({ _id: verificationToken._id });  // Optionally delete the token after successful verification

            res.status(200).send({ message: 'Email successfully verified!' });
        } else {
            res.status(400).send({ message: 'User not found' });
        }
    } catch (e) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
});


// Middleware to verify the user's token
export const userVerifyID = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const SECRET_KEY = process.env.USER_TOKEN_SECRET!;
    try {
        // Get the token from cookies or headers
        const token = req.cookies.ucid;

        if (!token) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }else{

        // Verify the token using the secret key
        const decoded = jwt.verify(token, SECRET_KEY) as CustomJwtPayload;
        if (!decoded || !decoded.id) {
            res.status(401).json({ success: false, message: 'Invalid token' });
            return;
        }

        // Find the user in the database using the decoded id
        const user = await Verify.findOne({ user_id:decoded.id});
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        const userD = await userModel.findById(decoded.id) as IUser | null;
        if (!userD) {
            res.status(404).json({ success: false, message: 'User not found nn' });
            return;
        }
        // Respond with success
        res.status(200).json({
            success: true,
            message: 'User verified successfully',
            user: {
                id: userD._id,
                name: userD.name,
                email: userD.mobile,
            },
        });

    }




    } catch (error) {
        console.error('Error verifying user token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
})


export const getUserProfile = asyncHandler(async (req, res) => {
    res.send("hhhhh")
})

