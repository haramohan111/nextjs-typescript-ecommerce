"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authMiddleware_1 = require("./middleware/authMiddleware");
const moment_timezone_1 = __importDefault(require("moment-timezone"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ["http://localhost:3001", "http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: 'ghfffniyiuyiyiynn789789', // Change this to a strong secret
    resave: false,
    saveUninitialized: true,
    store: connect_mongo_1.default.create({ mongoUrl: 'mongodb://localhost:27017/next-typescript-ecommerce' }), // Store sessions in MongoDB
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true, // Helps prevent XSS attacks
        sameSite: 'strict', // CSRF protection
        maxAge: 1 * 60 * 60 * 1000 // Session expiration time (24 minutes in milliseconds)
    },
    rolling: true // Resets the cookie expiration with each request
}));
// Get the current date and time in India (IST)
const indiaTime = (0, moment_timezone_1.default)().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
console.log(`Current date and time in India: ${indiaTime}`);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(errorMiddleware_1.errorHandler);
// Middleware to conditionally apply protect middleware
app.use((req, res, next) => {
    //console.log("req.path",req.path);
    const openRoutes = ['/api/v1/adminlogin', '/api/v1/managefrontcategory', '/api/v1/dealoftheday',
        '/api/v1/manageproductformen',
        '/api/v1/manageproductforwomenmen',
        '/api/v1/cart', '/api/v1/products', '/api/v1/logout', '/api/v1/adminrefresh', '/api/v1/adminverify',
        '/api/v1/userlogin', '/api/v1/userrefresh', '/api/v1/signup',
        '/api/v1/userverify', '/api/v1/userlogout', '/api/v1/payment', "/api/v1/paymentverify", "/set-session",
        "/api/v1/get-session", "/api/v1/get-sessions", "/api/v1/verify-email", "/api/v1/coupon/winter20", '/api/v1/homesearch',
        '/api/v1/gridlistproducts', '/api/v1/userverifyid', '/api/v1/createorder', '/api/v1/customeraddress', '/api/v1/updatecartuserid',
        '/api/v1/getclientorders', '/api/v1/addwishlist', '/api/v1/fetchwishlist', '/api/v1/todayfav', '/api/v1/manageproductsforkids',
        '/api/v1/manageproductsforbeauty', '/api/v1/manageproductsforwatch'];
    const dynamicOpenRoutes = /^\/api\/v1\/(addtocart|incqty|descqty|deletecart|productbyid|deletecartbasedonproductid)\/[^/]+(\/[^/]+)?$/;
    if (openRoutes.includes(req.path) || dynamicOpenRoutes.test(req.path)) {
        //console.log('Open route accessed:', req.path);
        return next();
    }
    //console.log('Protected route accessed:', req.path);
    (0, authMiddleware_1.protect)(req, res, next);
});
//app.use(protect) this is for all route
//end
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const categoryRoutes_1 = __importDefault(require("./routes/categoryRoutes"));
const subcategoryRoutes_1 = __importDefault(require("./routes/subcategoryRoutes"));
const listsubcategoryRoutes_1 = __importDefault(require("./routes/listsubcategoryRoutes"));
const webRoutes_1 = __importDefault(require("./routes/webRoutes"));
//frontroutes
const cartRoutes_1 = __importDefault(require("./routes/website/cartRoutes"));
const userRoutes_1 = __importDefault(require("./routes/website/userRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/website/paymentRoutes"));
const clientRoutes_1 = __importDefault(require("./routes/website/clientRoutes"));
app.use("/api/v1", categoryRoutes_1.default);
app.use("/api/v1", subcategoryRoutes_1.default);
app.use("/api/v1", listsubcategoryRoutes_1.default);
app.use("/api/v1", webRoutes_1.default);
//front routes
app.use('/api/v1', clientRoutes_1.default);
app.use('/api/v1', productRoutes_1.default);
app.use("/api/v1", cartRoutes_1.default);
app.use("/api/v1", userRoutes_1.default);
app.use("/api/v1", paymentRoutes_1.default);
app.listen(process.env.PORT, () => {
    console.log(`Server started on Port ${process.env.PORT}`.cyan);
});
