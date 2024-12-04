import express, { Request, Response, NextFunction } from 'express';
import { errorHandler } from "./middleware/errorMiddleware";
import { protect } from "./middleware/authMiddleware";
import moment from 'moment-timezone';
import colors from 'colors';
import cors from "cors";
import dotenv from "dotenv";
import session from 'express-session';
import MongoStore from 'connect-mongo';
import connectDB from "./config/db";
import cookieParser from 'cookie-parser';

dotenv.config()


connectDB()
const app = express()
app.use(cors({
  origin: ["http://localhost:3001", "http://localhost:3000"],
  methods: ["POST", "GET", "PUT", "DELETE"],
  credentials: true
}))
app.use(cookieParser());


app.use(session({
  secret: 'ghfffniyiuyiyiynn789789', // Change this to a strong secret
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({ mongoUrl: 'mongodb://localhost:27017/next-typescript-ecommerce' }), // Store sessions in MongoDB
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true, // Helps prevent XSS attacks
    sameSite: 'strict', // CSRF protection
    maxAge: 1 * 60 * 60 * 1000 // Session expiration time (24 minutes in milliseconds)
},
rolling: true // Resets the cookie expiration with each request
}));


// Get the current date and time in India (IST)
const indiaTime = moment().tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
console.log(`Current date and time in India: ${indiaTime}`);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(errorHandler);




// Middleware to conditionally apply protect middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  //console.log("req.path",req.path);
  const openRoutes = ['/api/v1/adminlogin', '/api/v1/managefrontcategory','/api/v1/dealoftheday' ,
    '/api/v1/manageproductformen',
    '/api/v1/manageproductforwomenmen',
    '/api/v1/cart', '/api/v1/products', '/api/v1/logout', '/api/v1/adminrefresh', '/api/v1/adminverify',
    '/api/v1/userlogin','/api/v1/userrefresh','/api/v1/signup',
    '/api/v1/userverify','/api/v1/userlogout','/api/v1/payment',"/api/v1/paymentverify","/set-session",
    "/api/v1/get-session","/api/v1/get-sessions","/api/v1/verify-email","/api/v1/coupon/winter20",'/api/v1/homesearch',
    '/api/v1/gridlistproducts','/api/v1/userverifyid','/api/v1/createorder','/api/v1/customeraddress','/api/v1/updatecartuserid',
    '/api/v1/getclientorders','/api/v1/addwishlist','/api/v1/fetchwishlist','/api/v1/todayfav','/api/v1/manageproductsforkids',
    '/api/v1/manageproductsforbeauty','/api/v1/manageproductsforwatch'];
    const dynamicOpenRoutes = /^\/api\/v1\/(addtocart|incqty|descqty|deletecart|productbyid|deletecartbasedonproductid)\/[^/]+(\/[^/]+)?$/;
  if (openRoutes.includes(req.path) || dynamicOpenRoutes.test(req.path)) {
    //console.log('Open route accessed:', req.path);
    return next();
  }
  //console.log('Protected route accessed:', req.path);
  protect(req, res, next);
});



//app.use(protect) this is for all route
//end

import product from './routes/productRoutes'
import category from "./routes/categoryRoutes"
import subcategory from "./routes/subcategoryRoutes"
import listsubcategory from "./routes/listsubcategoryRoutes"
import web from "./routes/webRoutes"


//frontroutes
import cart from "./routes/website/cartRoutes"
import user from "./routes/website/userRoutes"
import order from "./routes/website/paymentRoutes"
import client from "./routes/website/clientRoutes"


app.use("/api/v1", category)
app.use("/api/v1", subcategory)
app.use("/api/v1", listsubcategory)
app.use("/api/v1", web)

//front routes
app.use('/api/v1', client)
app.use('/api/v1', product)
app.use("/api/v1", cart)
app.use("/api/v1", user)
app.use("/api/v1", order)


app.listen(process.env.PORT, () => {
  console.log(`Server started on Port ${process.env.PORT}`.cyan)
})


