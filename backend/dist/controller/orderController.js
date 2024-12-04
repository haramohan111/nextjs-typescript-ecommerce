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
exports.orderPagination = exports.verifyPayment = exports.createOrder = exports.customerAddress = exports.checkout = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const razorpay_1 = __importDefault(require("razorpay"));
const crypto_1 = __importDefault(require("crypto"));
const orderModel_1 = __importDefault(require("../models/orderModel"));
const customerModel_1 = __importDefault(require("../models/customerModel"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// exports.createOrder = AsyncHandler(async (req, res) => {
//     var instance = new Razorpay({
//         key_id: process.env.KEY_ID,
//         key_secret: process.env.KEY_SECRET
//     });
//     const options = {
//         amount: req.body.amount * 100,
//         currency: "INR",
//     }
//     instance.orders.create(options, (error, order) => {
//         if (error) {
//             console.log(error)
//             return res.status(500).json({ message: "Something went wrong" })
//         }
//         res.status(200).json({ data: order })
//     })
// })
// export const checkout = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
//     const cartSessionId:string = req.cookies.cart_session_id; // Expect cart session ID and user ID from the client
//     const cookieData: string = req.cookies.ucid;
//         if (cookieData) {
//         const decoded = jwt.verify(cookieData, process.env.USER_TOKEN_SECRET!) as { id: string };
//         const userId = decoded.id;
//       // Check if the user exists
//       const user = await userModel.findById(userId);
//       if (!user) {
//          res.status(404).json({ success: false, message: 'User not found' });
//       }
//     }
//     const instance = new Razorpay({
//         key_id: process.env.KEY_ID as string,
//         key_secret: process.env.KEY_SECRET as string
//     });
//     const options: { amount: number; currency: string } = {
//         amount: Number(99 * 100),
//         currency: "INR",
//     };
//     const order = await instance.orders.create(options);
//     res.status(200).json({
//         success: true,
//         order
//     });
// });
exports.checkout = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartSessionId = req.cookies.cart_session_id; // Cart session ID from cookie
    const cookieData = req.cookies.ucid; // User cookie ID
    console.log("cartSessionId", cartSessionId, "cookieData", cookieData);
    if (!cartSessionId) {
        res.status(400).json({ success: false, message: 'Cart session ID is required' });
    }
    if (!cookieData) {
        res.status(400).json({ success: false, message: 'User cookie ID is required' });
    }
    // Verify the user from the cookie
    const decoded = jsonwebtoken_1.default.verify(cookieData, process.env.USER_TOKEN_SECRET);
    const userId = decoded.id;
    // Check if the user exists
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        res.status(404).json({ success: false, message: 'User not found' });
    }
    // Calculate the total cart amount based on cart_session_id and user_id
    const totalAmount = yield calculateCartAmount(cartSessionId, userId);
    try {
        // Initialize Razorpay instance
        const instance = new razorpay_1.default({
            key_id: process.env.KEY_ID,
            key_secret: process.env.KEY_SECRET
        });
        // Create Razorpay order with the total cart amount
        const options = {
            amount: totalAmount * 100, // Convert to paise
            currency: "INR",
        };
        const order = yield instance.orders.create(options);
        // Respond with success and order details
        res.status(200).json({
            success: true,
            order
        });
    }
    catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).json({ success: false, message: 'Server error during checkout' });
    }
}));
const calculateCartAmount = (cartSessionId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield cartModel_1.default.aggregate([
            {
                $match: {
                    cart_session_id: cartSessionId,
                }
            },
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$price"
                    }
                }
            }
        ]);
        return result.length > 0 ? result[0].total : 0; // Return the total price or 0 if no items
    }
    catch (error) {
        console.error('Error calculating cart amount:', error);
        throw new Error('Unable to calculate cart amount');
    }
});
exports.customerAddress = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json([{
            "name": "John Doe",
            "email": "john.doe@example.com",
            "phone": "1234567890",
            "address": "123 Main St, Cityville, ST, 12345",
            "county": "India",
            "state": "Odisha",
            "city": "Chicago",
            "zip": "4446767",
        },
        {
            "name": "Jane Smith",
            "email": "jane.smith@example.com",
            "phone": "0987654321",
            "address": "456 Elm St, Cityville, ST, 54321",
            "county": "India",
            "state": "Maharashtra",
            "city": "Chicago",
            "zip": "444535767",
        },
        {
            "name": "Alice Johnson",
            "email": "alice.johnson@example.com",
            "phone": "1122334455",
            "address": "789 Maple St, Cityville, ST, 67890",
            "county": "India",
            "state": "Karnataka",
            "city": "mahisy",
            "zip": "53453",
        }]);
}));
exports.createOrder = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { orderItems, shippingAddress, taxPrice, shippingPrice, itemsPrice, paymentMethod, postalCode, state, city } = req.body;
    const cookieID = req.cookies.ucid; // Assuming a cookie named `ucid` holds user session info
    const userId = yield getuserID(cookieID); // Extract user ID from the cookie
    const cartcookieID = req.cookies.cart_session_id;
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    if (!cartcookieID) {
        res.status(400).json({ message: 'cart cookie is missing' });
    }
    if (!cookieID) {
        res.status(400).json({ message: 'ucid cookie is missing' });
    }
    yield cartModel_1.default.updateMany({ cart_session_id: cartcookieID }, // Match documents with this cart_session_id
    { $set: { cart_session_id: null } } // Set cart_session_id to null
    );
    console.log(userId);
    const userIdFromSession = userId;
    if (!userIdFromSession) {
        res.status(400).json({ message: "Invalid or missing user ID" });
    }
    const customer = yield customerModel_1.default.create(shippingAddress);
    const order = yield orderModel_1.default.create({
        user: userIdFromSession,
        orderItems,
        shippingAddress: customer._id,
        taxPrice,
        shippingPrice,
        totalPrice: itemsPrice,
        payment: paymentMethod,
        postalCode: postalCode,
        city: city,
        country: state
    });
    if (order) {
        const odid = order._id.toString();
        req.session.order_id = odid; // Ensure order_id is properly set as a string
        console.log(order._id);
    }
    res.status(200).json({
        success: true,
        order
    });
}));
exports.verifyPayment = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const sorder_id = req.session.order_id;
    const cartSessionId = req.cookies.cart_session_id;
    console.log(sorder_id);
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto_1.default
        .createHmac("sha256", process.env.KEY_SECRET)
        .update(sign.toString())
        .digest("hex");
    if (razorpay_signature === expectedSign) {
        yield orderModel_1.default.findByIdAndUpdate(sorder_id, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            isPaid: true,
            paidAt: Date.now()
        });
        const carts = yield cartModel_1.default.find({ cart_session_id: cartSessionId });
        if (carts.length > 0) {
            yield cartModel_1.default.updateMany({ cart_session_id: cartSessionId }, { $set: { status: 0 } });
        }
        res.redirect("http://localhost:3000/account/orders");
    }
    else {
        res.status(400).json({ message: "Invalid signature sent!" });
    }
}));
exports.orderPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    let order;
    if (search) {
        order = yield orderModel_1.default.find({ "name": { "$regex": search, "$options": "i" } })
            .populate({ path: "orderItems", populate: { path: 'product_id' } })
            .sort([['_id', -1]]);
    }
    else {
        order = yield orderModel_1.default.find({})
            .populate({ path: "orderItems", populate: { path: 'product_id' } })
            .sort([['_id', -1]]);
    }
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const results = {};
    results.totalOrder = order.length;
    results.pageCount = Math.ceil(order.length / limit);
    if (lastIndex < order.length) {
        results.next = {
            page: page + 1,
        };
    }
    if (startIndex > 0) {
        results.prev = {
            page: page - 1,
        };
    }
    results.pageindex = startIndex;
    results.result = order.slice(startIndex, lastIndex);
    res.status(200).send({
        success: true,
        message: "get all orders",
        results
    });
}));
const getuserID = (cookieID) => __awaiter(void 0, void 0, void 0, function* () {
    if (!cookieID) {
        return null;
    }
    // Verify the user from the cookie
    const decoded = jsonwebtoken_1.default.verify(cookieID, process.env.USER_TOKEN_SECRET);
    const userId = decoded.id;
    // Check if the user exists
    const user = yield userModel_1.default.findById(userId);
    if (!user) {
        return null;
    }
    return user;
});
