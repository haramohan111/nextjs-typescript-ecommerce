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
const express_1 = __importDefault(require("express"));
const userController_1 = require("../../controller/userController");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const verifyModel_1 = __importDefault(require("../../models/verifyModel"));
const router = express_1.default.Router();
router.post('/signup', (req, res, next) => (0, userController_1.registerUser)(req, res, next));
router.post('/userlogin', (req, res, next) => (0, userController_1.loginUser)(req, res, next));
router.get('/profile', authMiddleware_1.protect, (req, res, next) => (0, userController_1.getUserProfile)(req, res, next));
router.post('/userverifyid', (req, res, next) => (0, userController_1.userVerifyID)(req, res, next));
router.post('/verify-email', (req, res, next) => (0, userController_1.verifyEmail)(req, res, next));
router.post('/userrefresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    console.log("refreshToken", refreshToken);
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            res.status(401).send('Invalid refresh token');
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: 'HS256',
            expiresIn: '60s'
        });
        yield userModel_1.default.updateOne({ _id: decoded.id }, { $set: { token: newAccessToken } });
        res.json({ accessToken: newAccessToken });
    }
    catch (error) {
        res.status(401).send('Invalid refresh token');
    }
}));
router.post('/userverify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieData = req.cookies.auth_token;
    try {
        if (cookieData) {
            const decoded = jsonwebtoken_1.default.verify(cookieData, process.env.USER_TOKEN_SECRET);
            if (decoded) {
                const userId = decoded.id;
                const user_sess_id = req.session.user_session_id;
                try {
                    const decodeUser = yield verifyModel_1.default.findOne({ user_id: userId });
                    if (decodeUser) {
                        console.log('true');
                        res.status(200).send({ success: true, message: 'Session in', user: decodeUser });
                    }
                    else {
                        console.log('false');
                        res.status(200).send({ success: false, message: 'Session out' });
                    }
                }
                catch (error) {
                    console.log(error);
                    res.status(400).send({ success: false, message: 'Invalid user ID' });
                }
            }
            else {
                res.status(200).send({ success: false, message: 'Session out' });
            }
        }
        else {
            res.status(200).send({ success: false, message: 'Session out' });
        }
    }
    catch (error) {
        res.status(400).send({ success: false, message: error });
    }
}));
router.post('/userlogout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // req.session.destroy(err => {
        //   if (err) {
        //     return res.status(500).send('Could not log out.');
        //   }
        //   res.clearCookie('uid');
        //   res.status(200).send({ success: false, message: 'You have been Logged Out' });
        // });
        // console.log(req.session)
        const cookieData = req.cookies.uid;
        const user_sess_id = req.session.user_session_id;
        if (cookieData) {
            const decoded = jsonwebtoken_1.default.verify(cookieData, process.env.ACCESS_TOKEN_SECRET);
            const userId = decoded.id;
            const userDelete = yield verifyModel_1.default.deleteOne({ user_id: userId, user_session_id: user_sess_id });
            console.log(userDelete);
            if (userDelete.acknowledged) {
                res.clearCookie('uid');
                res.status(200).send({ success: false, message: 'Session out' });
            }
        }
        else {
            res.clearCookie('uid');
            res.status(200).send({ success: false, message: 'Session out' });
        }
    }
    catch (error) {
        // res.status(400).send({ error: e, message: 'Logged out failed' });
        if (error instanceof Error) {
            console.error('Token has expired:', error);
        }
    }
}));
exports.default = router;
