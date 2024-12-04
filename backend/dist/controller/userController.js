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
exports.getUserProfile = exports.userVerifyID = exports.verifyEmail = exports.loginUser = exports.registerUser = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userModel_1 = __importDefault(require("../models/userModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = require("../utils/generateToken");
const verifyModel_1 = __importDefault(require("../models/verifyModel"));
const emailService_1 = require("../config/emailService");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verificationTokenModel_1 = __importDefault(require("../models/verificationTokenModel"));
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
exports.registerUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, mobileNo, password } = req.body;
        const nam = firstName + " " + lastName;
        // const newPassword = await hashPassword(password);
        // Validation
        if (!firstName || !lastName || !mobileNo || !password) {
            res.status(400).json({ message: 'All fields are required' });
        }
        const mobilecheck = yield userModel_1.default.findOne({ mobile: mobileNo });
        if (mobilecheck) {
            res.status(400).send({
                success: false,
                message: "User already exists"
            });
        }
        else {
            const user = yield userModel_1.default.create({
                name: nam,
                mobile: mobileNo,
                password,
                status: 1
            });
            if (user) {
                if (emailRegex.test(mobileNo)) {
                    // If mobileNo is an email, create a verification token and store it in the database
                    const token = jsonwebtoken_1.default.sign({ userId: user._id }, 'your-secret-key', { expiresIn: '1h' }); // Generate a JWT token
                    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
                    // Save the token in the database with an expiration date
                    const verificationToken = new verificationTokenModel_1.default({
                        user: user._id,
                        token,
                        expiresAt: new Date(Date.now() + 3600000) // 1 hour from now
                    });
                    yield verificationToken.save();
                    // Send verification email
                    yield (0, emailService_1.sendVerificationEmail)(mobileNo, verificationLink);
                    res.status(200).send({
                        success: true,
                        message: "User added successfully, verification email sent",
                        user
                    });
                }
                else {
                    res.status(200).send({
                        success: true,
                        message: "User added successfully",
                        user
                    });
                }
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "User not added"
                });
            }
        }
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
}));
exports.loginUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { mobileNo, password } = req.body;
    const user = yield userModel_1.default.findOne({ mobile: mobileNo }).select("-createdAt -updatedAt").exec();
    if (!user)
        res.status(400).send({
            success: false,
            message: "User not found please SignUp"
        });
    // if (user) {
    //     const isMatch = await user.matchPassword(password);
    //     console.log('Password Match:', isMatch)
    // }
    if (user)
        //console.log("check",await user.matchPassword(password))
        if (user && (yield user.matchPassword(password)) && user.status !== 0) {
            const accessToken = (0, generateToken_1.generateAccessToken)(user._id.toString());
            const refreshToken = (0, generateToken_1.generateRefreshToken)(user._id.toString());
            //res.cookie("accessToken", accessToken);
            if (user) {
                // Ensure _id is asserted to be a string
                // req.session.cookie.maxAge = 1000 * 60 * 60;
                const uid = user._id.toString();
                req.session.userId = uid;
                const user_session_id = "id" + Math.random().toString(16).slice(2);
                req.session.user_session_id = user_session_id;
                const userId = new mongoose_1.default.Types.ObjectId(user._id);
                let verifyuser;
                const verify = yield verifyModel_1.default.findOne({ user_id: user._id });
                if (!verify) {
                    verifyuser = yield verifyModel_1.default.create({ user_id: user._id, user_session_id: user_session_id });
                }
                const encryptedData = (0, generateToken_1.generateVerifyUserToken)(user._id.toString());
                res.cookie('ucid', encryptedData, { maxAge: 24 * 60 * 1000, httpOnly: false });
                res.status(200).send({
                    success: true,
                    message: "User login successfully",
                    accessToken,
                    refreshToken,
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Invalid mobile or email and password"
            });
        }
}));
// Endpoint to verify the email link
exports.verifyEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.body; // Get token from query parameter
        if (!token) {
            res.status(400).send({ message: 'Verification token is required' });
            return;
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, 'your-secret-key');
        const userId = decoded.userId;
        // Find the corresponding verification token
        const verificationToken = yield verificationTokenModel_1.default.findOne({ user: userId, token });
        if (!verificationToken) {
            res.status(400).send({ message: 'Invalid or expired verification token' });
            return;
        }
        if (verificationToken.expiresAt < new Date()) {
            res.status(400).send({ message: 'Verification token has expired' });
            return;
        }
        // Find the user and mark them as verified
        const user = yield userModel_1.default.findById(userId);
        if (user) {
            user.status = 2; // Assuming status 2 means verified
            yield user.save();
            yield verificationTokenModel_1.default.deleteOne({ _id: verificationToken._id }); // Optionally delete the token after successful verification
            res.status(200).send({ message: 'Email successfully verified!' });
        }
        else {
            res.status(400).send({ message: 'User not found' });
        }
    }
    catch (e) {
        res.status(500).send({ message: 'Internal Server Error' });
    }
}));
// Middleware to verify the user's token
exports.userVerifyID = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const SECRET_KEY = process.env.USER_TOKEN_SECRET;
    try {
        // Get the token from cookies or headers
        const token = req.cookies.ucid;
        if (!token) {
            res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
        }
        else {
            // Verify the token using the secret key
            const decoded = jsonwebtoken_1.default.verify(token, SECRET_KEY);
            if (!decoded || !decoded.id) {
                res.status(401).json({ success: false, message: 'Invalid token' });
                return;
            }
            // Find the user in the database using the decoded id
            const user = yield verifyModel_1.default.findOne({ user_id: decoded.id });
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
                return;
            }
            const userD = yield userModel_1.default.findById(decoded.id);
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
    }
    catch (error) {
        console.error('Error verifying user token:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}));
exports.getUserProfile = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.send("hhhhh");
}));
