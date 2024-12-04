import { Request, Response } from 'express';
import session from 'express-session';
import AsyncHandler from "express-async-handler";
import Razorpay from 'razorpay';
import crypto from "crypto";
import orderModel from "../models/orderModel";
import mongoose from 'mongoose';
import customerModel from '../models/customerModel';
import cartModel from "../models/cartModel";
import userModel from "../models/userModel";

import jwt from 'jsonwebtoken';
declare module 'express-session' {
    interface SessionData {
        order_id: string; // Add custom properties here
    }
}
interface IOrder {
    orderItems: any[];
    shippingAddress: any;
    taxPrice: number;
    shippingPrice: number;
    itemsPrice: number;
    paymentMethod: string;
    postalCode: number;
    state: string;
    city: string;
}



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


export const checkout = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cartSessionId: string = req.cookies.cart_session_id; // Cart session ID from cookie
    const cookieData: string = req.cookies.ucid; // User cookie ID
  console.log("cartSessionId",cartSessionId,"cookieData",cookieData)
    if (!cartSessionId) {
       res.status(400).json({ success: false, message: 'Cart session ID is required' });
    }
  
    if (!cookieData) {
       res.status(400).json({ success: false, message: 'User cookie ID is required' });
    }
  
    // Verify the user from the cookie
    const decoded = jwt.verify(cookieData, process.env.USER_TOKEN_SECRET!) as { id: string };
    const userId = decoded.id;
  
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
       res.status(404).json({ success: false, message: 'User not found' });
    }
          // Calculate the total cart amount based on cart_session_id and user_id
          const totalAmount = await calculateCartAmount(cartSessionId, userId);

    try {


      // Initialize Razorpay instance
      const instance = new Razorpay({
        key_id: process.env.KEY_ID as string,
        key_secret: process.env.KEY_SECRET as string
      });
  
      // Create Razorpay order with the total cart amount
      const options = {
        amount: totalAmount * 100, // Convert to paise
        currency: "INR",
      };
  
      const order = await instance.orders.create(options);
  
      // Respond with success and order details
      res.status(200).json({
        success: true,
        order
      });
    } catch (error) {
      console.error('Error during checkout:', error);
      res.status(500).json({ success: false, message: 'Server error during checkout' });
    }
  });
  

  const calculateCartAmount = async (cartSessionId: string, userId: string) => {
    try {
      const result = await cartModel.aggregate([
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
    ])

      return result.length > 0 ? result[0].total : 0; // Return the total price or 0 if no items
    } catch (error) {
      console.error('Error calculating cart amount:', error);
      throw new Error('Unable to calculate cart amount');
    }
  };

export const customerAddress = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
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
    }])
})



export const createOrder = AsyncHandler(async (req: Request, res: Response): Promise<void> => {

    const { orderItems, shippingAddress, taxPrice, shippingPrice, itemsPrice, paymentMethod, postalCode, state, city } = req.body as IOrder;
    const cookieID = req.cookies.ucid; // Assuming a cookie named `ucid` holds user session info
    const userId = await getuserID(cookieID); // Extract user ID from the cookie
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
     await cartModel.updateMany(
        { cart_session_id: cartcookieID }, // Match documents with this cart_session_id
        { $set: { cart_session_id: null } } // Set cart_session_id to null
      );
     console.log(userId)
    const userIdFromSession = userId;
    if (!userIdFromSession) {
        res.status(400).json({ message: "Invalid or missing user ID" });
    }
    const customer = await customerModel.create(shippingAddress)

    const order = await orderModel.create({
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
    if(order){
        const odid = order._id.toString();
        req.session.order_id = odid; // Ensure order_id is properly set as a string
        console.log(order._id)
    }


    res.status(200).json({
        success: true,
        order
    });
});
export const verifyPayment = AsyncHandler(async (req: Request, res: Response): Promise<void> => {

    const sorder_id: string = req.session.order_id as string;
    const cartSessionId = req.cookies.cart_session_id as string;
    console.log(sorder_id)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body as {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
    };

    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
        .createHmac("sha256", process.env.KEY_SECRET as string)
        .update(sign.toString())
        .digest("hex");

    if (razorpay_signature === expectedSign) {
        await orderModel.findByIdAndUpdate(sorder_id, {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            isPaid: true,
            paidAt: Date.now()
        });
        const carts = await cartModel.find({cart_session_id:cartSessionId});
        if (carts.length > 0) {
            await cartModel.updateMany(
                { cart_session_id: cartSessionId },
                { $set: { status: 0 } }
            );
        }
        res.redirect("http://localhost:3000/account/orders");
    } else {
        res.status(400).json({ message: "Invalid signature sent!" });
    }
});

export const orderPagination = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let order;

    if (search) {
        order = await orderModel.find({ "name": { "$regex": search, "$options": "i" } })
            .populate({ path: "orderItems", populate: { path: 'product_id' } })
            .sort([['_id', -1]]);
    } else {
        order = await orderModel.find({})
            .populate({ path: "orderItems", populate: { path: 'product_id' } })
            .sort([['_id', -1]]);
    }

    const page: number = parseInt(req.query.page as string, 10);
    const limit: number = parseInt(req.query.limit as string, 10);

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results: any = {};
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
});

const getuserID = async (cookieID: string) => {
    if (!cookieID) {
      return null
    }
  
    // Verify the user from the cookie
    const decoded = jwt.verify(cookieID, process.env.USER_TOKEN_SECRET!) as { id: string };
    const userId = decoded.id;
  
    // Check if the user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return null
    }
    return user
  }