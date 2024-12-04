"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const crypto_1 = __importDefault(require("crypto"));
const algorithm = 'aes-256-cbc';
const key = Buffer.from('0123456789abcdef0123456789abcdef', 'utf8'); // 32 bytes long key
// Encrypt function
function encrypt(text) {
    const iv = crypto_1.default.randomBytes(16);
    console.log('Key for encryption:', key.toString('hex'));
    console.log('IV for encryption:', iv.toString('hex'));
    const cipher = crypto_1.default.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const result = iv.toString('hex') + ':' + encrypted;
    console.log('Encrypted Data:', result);
    return result;
}
// Decrypt function
function decrypt(text) {
    try {
        const parts = text.split(':');
        const iv = Buffer.from(parts.shift(), 'hex');
        console.log('Key for decryption:', key.toString('hex'));
        console.log('IV for decryption:', iv.toString('hex'));
        const encryptedText = parts.join(':');
        console.log('Encrypted Text:', encryptedText);
        const decipher = crypto_1.default.createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        console.log('Decrypted Data:', decrypted);
        return decrypted;
    }
    catch (error) {
        console.error('Decryption failed:', error.message);
        return '';
    }
}
// // Test the functions
// const testString = '67138ee0d2499cc5ad4916ce'; // Sample ObjectId
// const encryptedData = encrypt(testString);
// const decryptedData = decrypt(encryptedData);
// console.log('Original Data:', testString);
// console.log('Decrypted Data:', decryptedData);
