"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Order schema
const orderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    razorpay_order_id: {
        type: String,
    },
    razorpay_payment_id: {
        type: String,
    },
    razorpay_signature: {
        type: String,
    },
    orderItems: [
        {
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
            },
            price: {
                type: Number,
                required: true,
            },
            product_id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
        },
    ],
    shippingAddress: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    payment: {
        type: String,
        required: true,
    },
    paymentResults: {
        id: { type: String },
        status: { type: String },
        update_time: { type: String },
        email_address: { type: String },
    },
    taxPrice: {
        type: Number,
        default: 0.0,
    },
    shippingPrice: {
        type: Number,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        default: 0.0,
    },
    isPaid: {
        type: Boolean,
        required: true,
        default: false,
    },
    paidAt: {
        type: Date,
    },
    isDelevired: {
        type: Boolean,
        default: false,
    },
    DeleviredAt: {
        type: Date,
    },
    amount: {
        type: Number,
    },
    currency: {
        type: String,
    },
    receipt: {
        type: String,
    },
}, { timestamps: true });
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
