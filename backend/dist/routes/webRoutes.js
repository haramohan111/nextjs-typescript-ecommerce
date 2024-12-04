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
const brandController_1 = require("../controller/brandController");
const colorController_1 = require("../controller/colorController");
const sizeController_1 = require("../controller/sizeController");
const sellerController_1 = require("../controller/sellerController");
const adminloginController_1 = require("../controller/adminloginController");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const orderController_1 = require("../controller/orderController");
const userModel_1 = __importDefault(require("../models/userModel"));
const verifyModel_1 = __importDefault(require("../models/verifyModel"));
const router = express_1.default.Router();
router.post('/addbrand', (req, res, next) => (0, brandController_1.addBrand)(req, res));
router.get('/getbrand', (req, res, next) => (0, brandController_1.getBrand)(req, res, next));
router.get('/brandpagination', (req, res, next) => (0, brandController_1.brandPagination)(req, res, next));
router.post('/addcolor', (req, res, next) => (0, colorController_1.addColor)(req, res, next));
router.get('/colorpagination', (req, res, next) => (0, colorController_1.colorPagination)(req, res, next));
router.get('/getcolor', (req, res, next) => (0, colorController_1.getColor)(req, res, next));
router.post('/addsize', (req, res, next) => (0, sizeController_1.addSize)(req, res, next));
router.get('/sizepagination', (req, res, next) => (0, sizeController_1.sizePagination)(req, res, next));
router.get('/getsize', (req, res, next) => (0, sizeController_1.getSize)(req, res, next));
router.post('/addseller', (req, res, next) => (0, sellerController_1.addSeller)(req, res, next));
router.get('/sellerpagination', (req, res, next) => (0, sellerController_1.selerPagination)(req, res, next));
router.get('/getseller', (req, res, next) => (0, sellerController_1.getSeller)(req, res, next));
router.post('/adminlogin', (req, res, next) => (0, adminloginController_1.adminLogin)(req, res));
// router.get("/authcheck/:id", (req: Request, res: Response, next: NextFunction) => authCheck(req, res, next));
router.post('/createorder', (req, res, next) => (0, orderController_1.createOrder)(req, res, next));
router.get('/orderpagination', (req, res, next) => (0, orderController_1.orderPagination)(req, res, next));
router.get('/customeraddress', (req, res, next) => (0, orderController_1.customerAddress)(req, res, next));
router.post('/logout', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            res.status(200).send({ message: 'You have been Logged Out' });
            return;
        }
        const secret = process.env.ACCESS_TOKEN_SECRET;
        if (!secret) {
            throw new Error('ACCESS_TOKEN_SECRET is not defined');
        }
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        //console.log({ web: "web", id: (decoded as JwtPayload).id, token });
        const user = yield userModel_1.default.updateOne({ _id: decoded.id }, { $set: { token: "" } });
        const verify = yield verifyModel_1.default.deleteOne({ user_id: decoded.id });
        if (user && verify) {
            const dbToken = yield userModel_1.default.findOne({ token });
            if (dbToken == null) {
                res.status(200).send({ message: 'You have been Logged Out' });
            }
            else {
                res.status(400).send({ message: 'Logged out failed' });
            }
        }
        else {
            res.status(400).send({ message: 'You have been Logged Out' });
        }
    }
    catch (error) {
        // res.status(400).send({ error: e, message: 'Logged out failed' });
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                console.error('Token has expired:', error);
                res.status(401).json({ message: 'Token has expired' });
            }
            else {
                console.error('Token verification failed:', error);
                res.status(403).json({ message: 'Invalid token' });
            }
        }
        else {
            console.error('Unexpected error:', error);
            res.status(500).json({ message: 'An unexpected error occurred' });
        }
    }
}));
router.post('/adminrefresh', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { refreshToken } = req.body;
    // console.log("refreshToken", refreshToken);
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
router.post('/adminverify', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const uid = req.cookies.auth_token;
    if (uid === "undefined") {
        res.status(200).send({ success: false, message: 'Session out' });
    }
    else {
        const decoded = jsonwebtoken_1.default.verify(uid, process.env.ADMIN_TOKEN_SECRET);
        if (decoded) {
            const userId = decoded.id;
            const user_sess_id = req.session.user_session_id;
            try {
                const decodeUser = yield verifyModel_1.default.find({ user_id: userId, user_session_id: user_sess_id });
                if (decodeUser.length === 0) {
                    res.status(200).send({ success: false, message: 'Session out' });
                }
                else {
                    res.status(200).send({ success: true, message: 'Session in' });
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
}));
exports.default = router;
