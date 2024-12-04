"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateAccessToken = generateAccessToken;
exports.generateRefreshToken = generateRefreshToken;
exports.generateVerifyAdminToken = generateVerifyAdminToken;
exports.generateVerifyUserToken = generateVerifyUserToken;
// import { createRequire } from 'module';
// const require = createRequire(import.meta.url);
const jsonwebtoken_1 = require("jsonwebtoken");
function generateAccessToken(id) {
    const token = (0, jsonwebtoken_1.sign)({ id }, process.env.ACCESS_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '60s'
    });
    return token;
}
function generateRefreshToken(id) {
    const token = (0, jsonwebtoken_1.sign)({ id }, process.env.REFRESH_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '5d'
    });
    return token;
}
function generateVerifyAdminToken(id) {
    const token = (0, jsonwebtoken_1.sign)({ id }, process.env.ADMIN_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    return token;
}
function generateVerifyUserToken(id) {
    const token = (0, jsonwebtoken_1.sign)({ id }, process.env.USER_TOKEN_SECRET, {
        algorithm: 'HS256',
        expiresIn: '1h'
    });
    return token;
}
//export default generateToken
