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
exports.deleteCartBasedonproductId = exports.fetchWishList = exports.addToWishlist = exports.getClientOrders = exports.gridListProduct = exports.productContainer = exports.todayfav = exports.manageProductsForWatch = exports.manageProductsForBeauty = exports.manageProductsForKids = exports.manageProductsForWomen = exports.manageProductsForMen = exports.dealofday = exports.productCategorySlider = exports.slider = exports.homeSearch = void 0;
const productModel_1 = __importDefault(require("../../models/productModel"));
const orderModel_1 = __importDefault(require("../../models/orderModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const listSubcategoryModel_1 = __importDefault(require("../../models/listSubcategoryModel"));
const wishlistModel_1 = __importDefault(require("../../models/wishlistModel"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../../models/userModel"));
const cartModel_1 = __importDefault(require("../../models/cartModel"));
exports.homeSearch = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        // Build the search criteria
        const searchCriteria = {};
        if (name) {
            searchCriteria.name = { $regex: name, $options: "i" }; // Case-insensitive search
        }
        // Fetch products with the search criteria
        const products = yield productModel_1.default.find(searchCriteria)
            .populate({ path: "category_id" })
            .populate({ path: "subcategory_id" })
            .populate({ path: "listsubcategory_id" });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: "Failed to search products", error });
    }
}));
exports.slider = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });
    res.json(products);
}));
exports.productCategorySlider = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });
    res.json(products);
}));
exports.dealofday = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categories = ['men', 'women', 'kids', 'beauty'];
    const products = yield productModel_1.default.aggregate([
        {
            $lookup: {
                from: 'categories', // Collection name for categories
                localField: 'category_id',
                foreignField: '_id',
                as: 'category',
            },
        },
        { $unwind: '$category' }, // Unwind the joined category array
        {
            $match: {
                'category.name': { $in: categories }, // Filter products by category names
                status: 1,
            },
        },
        {
            $sort: { 'createdAt': 1 }, // Optional: Sort products by creation date
        },
        {
            $group: {
                _id: '$category.name', // Group by category name
                firstProduct: { $first: '$$ROOT' }, // Get the first product in each group
            },
        },
        {
            $lookup: {
                from: 'subcategories', // Collection name for subcategories
                localField: 'firstProduct.subcategory_id',
                foreignField: '_id',
                as: 'subcategory',
            },
        },
        {
            $lookup: {
                from: 'listsubcategories', // Collection name for listsubcategories
                localField: 'firstProduct.listsubcategory_id',
                foreignField: '_id',
                as: 'listsubcategory',
            },
        },
        {
            $project: {
                _id: 0,
                category: '$_id', // Include category name
                product: {
                    _id: '$firstProduct._id',
                    name: '$firstProduct.name',
                    price: '$firstProduct.price',
                    description: '$firstProduct.description',
                    image: '$firstProduct.image',
                    subcategory: { $arrayElemAt: ['$subcategory', 0] }, // Include first subcategory
                    listsubcategory: { $arrayElemAt: ['$listsubcategory', 0] }, // Include first listsubcategory
                },
            },
        },
    ]);
    res.json(products);
}));
exports.manageProductsForMen = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({
        path: 'category_id',
        match: { name: 'men' }, // Filter only "Men" and "Women" categories
    })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' })
        .limit(8)
        .exec();
    // Filter out products where `category_id` does not exist (because it didn't match "Men" or "Women")
    const filteredProducts = products.filter(product => product.category_id);
    res.json(filteredProducts);
}));
exports.manageProductsForWomen = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({
        path: 'category_id',
        match: { name: { $in: ['women'] } }, // Filter only "Men" and "Women" categories
    })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' })
        .exec();
    // Filter out products where `category_id` does not exist (because it didn't match "Men" or "Women")
    const filteredProducts = products.filter(product => product.category_id);
    res.json(filteredProducts);
}));
exports.manageProductsForKids = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({
        path: 'category_id',
        match: { name: { $in: ['kids'] } }, // Filter only "Men" and "Women" categories
    })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' })
        .exec();
    // Filter out products where `category_id` does not exist (because it didn't match "Men" or "Women")
    const filteredProducts = products.filter(product => product.category_id);
    res.json(filteredProducts);
}));
exports.manageProductsForBeauty = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({
        path: 'category_id',
        match: { name: { $in: ['beauty'] } }, // Filter only "Men" and "Women" categories
    })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' })
        .exec();
    // Filter out products where `category_id` does not exist (because it didn't match "Men" or "Women")
    const filteredProducts = products.filter(product => product.category_id);
    res.json(filteredProducts);
}));
exports.manageProductsForWatch = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({
        path: 'category_id', // Populates category details
    })
        .populate({
        path: 'subcategory_id',
        match: { name: 'watch' }, // Filters subcategories with the name "watch"
    })
        .populate({
        path: 'listsubcategory_id', // Populates list subcategory details (if needed)
    })
        .exec();
    // Filter out products where `subcategory_id` does not exist (because it didn't match "watch")
    const filteredProducts = products.filter(product => product.subcategory_id);
    res.json(filteredProducts);
}));
exports.todayfav = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });
    res.json(products);
}));
exports.productContainer = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });
    res.json(products);
}));
exports.gridListProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name } = req.query;
        if (!name) {
            res.status(400).json({ message: 'Name parameter is required.' });
        }
        // Fetch the listsubcategory_id that matches the given name
        const matchingListSubcategories = yield listSubcategoryModel_1.default.find({
            name: { $regex: name, $options: 'i' }, // Case-insensitive search
        });
        // Extract matching IDs
        const matchingIds = matchingListSubcategories.map((item) => item._id);
        if (matchingIds.length === 0) {
            res.status(404).json({ message: 'No matching list subcategories found.' });
        }
        // Find products with matching listsubcategory_id
        const products = yield productModel_1.default.find({
            listsubcategory_id: { $in: matchingIds },
        })
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .populate({ path: 'listsubcategory_id' });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to search products', error });
    }
}));
exports.getClientOrders = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookieID = req.cookies.ucid;
        if (!cookieID) {
            res.status(400).json({ message: 'ucid cookie is missing' });
        }
        const userId = yield getuserID(cookieID);
        if (!userId) {
            res.status(404).json({ message: 'User not found' });
        }
        const orders = yield orderModel_1.default.find({ user: userId })
            .populate({ path: 'orderItems.product_id' })
            .populate({ path: 'shippingAddress' })
            .sort({ createdAt: -1 });
        if (!orders || orders.length === 0) {
            res.status(404).json({ message: 'No orders found for this user' });
        }
        res.status(200).json(orders);
    }
    catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Failed to fetch orders', error: (error === null || error === void 0 ? void 0 : error.message) || 'Unknown error' });
    }
}));
// Add product to the wishlist
exports.addToWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.body; // Get the product ID from the request body
    const cookieID = req.cookies.ucid;
    const userId = yield getuserID(cookieID);
    try {
        // Check if the product exists
        const productid = yield productModel_1.default.findById(productId);
        if (!productid) {
            res.status(404).json({ message: 'Product not found' });
        }
        // Find or create a wishlist for the user
        let wishlist = yield wishlistModel_1.default.findOne({ userId, productId });
        if (wishlist) {
            const result = yield wishlistModel_1.default.deleteOne({ userId, productId });
            // if (result.deletedCount > 0) {
            //   res.status(200).json({ success:true,message: 'Product removed from wishlist' });
            // } else {
            //   res.status(400).json({ success:true,message: 'Product not removed from wishlist' });
            // }
        }
        else {
            const user = yield wishlistModel_1.default.create({ userId, productId });
            if (user) {
                res.status(200).json({ success: true, message: 'Product added to wishlist' });
            }
            else {
                res.status(400).json({ success: false, message: 'Product not added to wishlist' });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
exports.fetchWishList = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookieID = req.cookies.ucid; // Assuming a cookie named `ucid` holds user session info
    const userId = getuserID(cookieID); // Extract user ID from the cookie
    if (!userId) {
        res.status(401).json({ message: 'Unauthorized: User not logged in' });
    }
    try {
        // Fetch the wishlist items for the user
        const wishlist = yield wishlistModel_1.default.find({});
        if (!wishlist.length) {
            res.status(200).json({ success: false, message: 'Wishlist is empty', wishlist: [] });
        }
        else {
            res.status(200).json({ success: true, message: 'Wishlist fetched successfully', wishlist });
        }
    }
    catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching wishlist' });
    }
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
exports.deleteCartBasedonproductId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cartSessionId = req.cookies.cart_session_id;
        if (!cartSessionId) {
            res.status(400).json({ message: 'No cart session ID found.' });
            return;
        }
        const id = req.params.id;
        const cart = yield cartModel_1.default.deleteOne({ product_id: id });
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
