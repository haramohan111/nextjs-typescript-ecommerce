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
exports.updateCartUserId = exports.couponCode = exports.deleteCart = exports.descQty = exports.incQty = exports.cartList = exports.addtocart = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cartModel_1 = __importDefault(require("../models/cartModel"));
const productModel_1 = __importDefault(require("../models/productModel"));
const couponModel_1 = __importDefault(require("../models/couponModel"));
const userModel_1 = __importDefault(require("../models/userModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.addtocart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const pid = req.params.pid;
    const qty = parseInt(req.params.qty);
    if (!pid || isNaN(qty) || qty <= 0) {
        res.status(400).json({ message: 'Invalid product ID or quantity.' });
        return;
    }
    const product = yield productModel_1.default.findById(pid).exec();
    if (!product) {
        res.status(404).json({ message: 'Product not found.' });
        return;
    }
    let cart_session_id;
    const cartSessionId = req.cookies.cart_session_id;
    if (!cartSessionId) {
        cart_session_id = "id" + Math.random().toString(16).slice(2);
    }
    else {
        cart_session_id = cartSessionId;
    }
    const existingCartItem = yield cartModel_1.default.findOne({ product_id: pid, cart_session_id: cartSessionId, status: 1 }).exec();
    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + qty;
        const newPrice = product.price * newQuantity;
        yield cartModel_1.default.findByIdAndUpdate(existingCartItem._id, { quantity: newQuantity, price: newPrice }).exec();
    }
    else {
        const newPrice = product.price * qty;
        const cartItemData = {
            product_id: pid,
            quantity: qty,
            price: newPrice,
            cart_session_id: cart_session_id,
            user_id: null
        };
        yield cartModel_1.default.create(cartItemData);
    }
    const cart = yield cartModel_1.default.find({}).populate({ path: 'product_id' }).exec();
    //Set cookie
    res.cookie('cart_session_id', cart_session_id, {
        maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
        httpOnly: false,
        secure: false, // Change to true if using HTTPS
        sameSite: 'lax'
    });
    res.json(cart);
}));
exports.cartList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Access the cart_session_id cookie
    const cartSessionId = req.cookies.cart_session_id;
    if (!cartSessionId) {
        res.status(400).json({ message: 'No cart session ID found.' });
        return;
    }
    // Calculate the total price based on cart_session_id
    const totalPrice = yield cartModel_1.default.aggregate([
        {
            $match: { cart_session_id: cartSessionId, status: 1 }
        },
        {
            $group: {
                _id: null,
                total: { $sum: "$price" }
            }
        }
    ]);
    // Fetch all cart items for the given cart_session_id
    const allCart = yield cartModel_1.default.find({ cart_session_id: cartSessionId, status: 1 })
        .populate({ path: 'product_id' });
    const userId = req.session.userId;
    // Prepare the response data
    const data = { allCart, totalPrice: ((_a = totalPrice[0]) === null || _a === void 0 ? void 0 : _a.total) || 0, userId }; // Handle case where totalPrice might be empty
    res.json(data);
}));
exports.incQty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const cartSessionId = req.cookies.cart_session_id;
    if (!cartSessionId) {
        res.status(400).json({ message: 'No cart session ID found.' });
        return;
    }
    const cartid = req.params.id;
    const cart = yield cartModel_1.default.findById({ _id: cartid });
    if (!cart) {
        res.status(404).json({ success: false, message: "Cart item not found" });
        return;
    }
    const productid = cart.product_id;
    const product = yield productModel_1.default.findById({ _id: productid, cart_session_id: cartSessionId });
    if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
    const price = product.price;
    const qty = cart.quantity + Number(1);
    const cartPrice = cart.price + product.price;
    const cartinc = yield cartModel_1.default.findOneAndUpdate({ _id: cartid }, { quantity: qty, price: cartPrice }, { new: true });
    if (cartinc) {
        let totalPrice = yield cartModel_1.default.aggregate([
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
        const allCart = yield cartModel_1.default.find({ cart_session_id: cartSessionId })
            .populate({ path: 'product_id' });
        const data = { allCart, totalPrice: ((_a = totalPrice[0]) === null || _a === void 0 ? void 0 : _a.total) || 0 };
        res.json(data);
    }
}));
exports.descQty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const cartSessionId = req.cookies.cart_session_id;
    if (!cartSessionId) {
        res.status(400).json({ message: 'No cart session ID found.' });
        return;
    }
    const cartid = req.params.id;
    const cart = yield cartModel_1.default.findById({ _id: cartid });
    if (!cart) {
        res.status(404).json({ success: false, message: "Cart item not found" });
        return;
    }
    const productid = cart.product_id;
    const product = yield productModel_1.default.findById({ _id: productid, cart_session_id: cartSessionId });
    if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
    //const price = product.price
    let allCart, data, totalPrice;
    if (cart.quantity > 1) {
        const qty = cart.quantity - Number(1);
        const cartPrice = cart.price - Number(product.price);
        const cartdesc = yield cartModel_1.default.findOneAndUpdate({ _id: cartid }, { quantity: qty, price: cartPrice }, { new: true });
        if (cartdesc) {
            totalPrice = yield cartModel_1.default.aggregate([
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
            allCart = yield cartModel_1.default.find({ cart_session_id: cartSessionId })
                .populate({ path: 'product_id' });
            const data = { allCart, totalPrice: ((_a = totalPrice[0]) === null || _a === void 0 ? void 0 : _a.total) || 0 };
            res.json(data);
        }
    }
    else {
        totalPrice = yield cartModel_1.default.aggregate([
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
        allCart = yield cartModel_1.default.find({ cart_session_id: cartSessionId })
            .populate({ path: 'product_id' });
        const data = { allCart, totalPrice: ((_b = totalPrice[0]) === null || _b === void 0 ? void 0 : _b.total) || 0 };
        res.json(data);
    }
}));
exports.deleteCart = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartSessionId = req.cookies.cart_session_id;
        if (!cartSessionId) {
            res.status(400).json({ message: 'No cart session ID found.' });
            return;
        }
        const id = req.params.id;
        const cart = yield cartModel_1.default.deleteOne({ _id: id });
        if (cart) {
            const totalprice = yield cartModel_1.default.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$price"
                        }
                    }
                }
            ]);
            const allCart = yield cartModel_1.default.find({ cart_session_id: cartSessionId }).populate({ path: 'product_id' });
            const data = { allCart, totalprice };
            res.status(200).json(data);
        }
    }
    catch (e) {
        res.status(500).json({
            success: false,
            error: e,
            message: "Something went wrong"
        });
    }
}));
exports.couponCode = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cp = req.params.coupon;
        const getcoupon = yield couponModel_1.default.findOne({ coupon: cp });
        if (!getcoupon) {
            res.status(404).json({ success: false, message: "Coupon not found" });
            return;
        }
        const totalprice = yield cartModel_1.default.aggregate([
            {
                $group: {
                    _id: null,
                    total: {
                        $sum: "$price"
                    }
                }
            }
        ]);
        const newprice = totalprice.map(tp => ({ newprice: tp.total }));
        let discountvalue;
        let discountprice;
        let desc = getcoupon.description;
        if (getcoupon.coupontype === "flat") {
            discountvalue = getcoupon.value;
            discountprice = Number(newprice[0].newprice) - discountvalue;
        }
        else if (getcoupon.coupontype === "percentage") {
            discountvalue = getcoupon.value;
            const percentagecalc = (discountvalue * Number(newprice[0].newprice)) / 100;
            discountprice = Number(newprice[0].newprice) - percentagecalc;
        }
        else {
            res.status(400).json({ success: false, message: "Invalid coupon type" });
            return;
        }
        const allcart = yield cartModel_1.default.find({}).populate({ path: 'product_id' });
        const data = { allcart, totalprice, discountprice, discountvalue, desc };
        res.status(200).json(data);
    }
    catch (e) {
        res.status(400).json({
            success: false,
            error: e,
            message: "Something went wrong"
        });
    }
}));
// Update user_id in the cart
exports.updateCartUserId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cartSessionId = req.cookies.cart_session_id; // Expect cart session ID and user ID from the client
    const cookieData = req.cookies.ucid;
    try {
        if (cookieData) {
            const decoded = jsonwebtoken_1.default.verify(cookieData, process.env.USER_TOKEN_SECRET);
            const userId = decoded.id;
            // Check if the user exists
            const user = yield userModel_1.default.findById(userId);
            if (!user) {
                res.status(404).json({ success: false, message: 'User not found' });
            }
            // Update the cart items
            const updatedCart = yield cartModel_1.default.updateMany({ cart_session_id: cartSessionId }, // Filter by session ID
            { user_id: userId } // Update user_id
            );
            // If no cart items were updated
            if (updatedCart.modifiedCount === 0) {
                res.status(404).json({ success: false, message: 'No cart items found for this session' });
            }
            // Success response
            res.status(200).json({ success: true, message: 'Cart updated successfully' });
        }
        else {
            res.status(404).json({ success: false, message: 'No user ID' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
}));
