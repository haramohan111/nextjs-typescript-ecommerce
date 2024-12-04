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
exports.adminLogin = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = require("../utils/generateToken");
const verifyModel_1 = __importDefault(require("../models/verifyModel"));
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const admin = yield userModel_1.default.findOne({ email });
    if (admin && (yield admin.matchPassword(password))) {
        const accessToken = (0, generateToken_1.generateAccessToken)(admin._id.toString());
        const refreshToken = (0, generateToken_1.generateRefreshToken)(admin._id.toString());
        const uid = admin._id.toString();
        req.session.adminId = uid;
        //console.log(req.session);
        const user = yield userModel_1.default.updateOne({ _id: admin._id }, { $set: { token: accessToken } });
        const verify = yield verifyModel_1.default.findOne({ user_id: admin._id });
        let verifyuser;
        if (!verify) {
            verifyuser = yield verifyModel_1.default.create({ user_id: admin._id, token: accessToken });
        }
        const encryptedData = (0, generateToken_1.generateVerifyAdminToken)(admin._id.toString());
        res.cookie('uaid', encryptedData, { maxAge: 24 * 60 * 1000, httpOnly: false });
        res.status(200).send({
            success: true,
            message: "login successfully",
            accessToken,
            refreshToken
        });
    }
    else {
        res.status(401).json({
            success: false,
            message: "unauthorized user",
        });
    }
});
exports.adminLogin = adminLogin;
