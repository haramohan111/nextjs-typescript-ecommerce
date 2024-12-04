import { Request, Response } from 'express';
import AsyncHandler from "express-async-handler";
import cartModel from "../models/cartModel";
import productModel from "../models/productModel";
import couponModel from "../models/couponModel";
import session from 'express-session';
import mongoose from 'mongoose'
import userModel from "../models/userModel";
import jwt, { JwtPayload } from 'jsonwebtoken';
// Interface for Coupon
interface ICoupon {
    _id: mongoose.Types.ObjectId;
    coupon: string;
    coupontype: string;
    value: number;
    description: string;
}
interface IProduct {
    _id: string;
    price: number;
}

interface ICart {
    _id: string;
    product_id: string;
    quantity: number;
    price: number;
    cart_session_id?: string;
}
// exports.testCart = (req,res)=>{
//     const sessionuser = req.session.user;
//     console.log(sessionuser)
//     res.json(sessionuser)
// }

declare module 'express-session' {
    interface SessionData {
        cart_session_id: string;
        userid?: string; // If you have this property
        cart_id?: string; // If you have this property
    }
}



export const addtocart = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const pid: string = req.params.pid;
    const qty: number = parseInt(req.params.qty);

    if (!pid || isNaN(qty) || qty <= 0) {
        res.status(400).json({ message: 'Invalid product ID or quantity.' });
        return;
    }

    const product = await productModel.findById(pid).exec();
    if (!product) {
        res.status(404).json({ message: 'Product not found.' });
        return;
    }

    let cart_session_id:string;
    const cartSessionId = req.cookies.cart_session_id;
    if(!cartSessionId){
       cart_session_id= "id" + Math.random().toString(16).slice(2)
    }else{
        cart_session_id=cartSessionId
    }

    const existingCartItem = await cartModel.findOne({ product_id: pid,cart_session_id: cartSessionId,status:1 }).exec();



    if (existingCartItem) {
        const newQuantity = existingCartItem.quantity + qty;
        const newPrice = product.price * newQuantity;
        await cartModel.findByIdAndUpdate(existingCartItem._id, { quantity: newQuantity, price: newPrice }).exec();
    } else {

        const newPrice = product.price * qty;
        const cartItemData = {
            product_id: pid,
            quantity: qty,
            price: newPrice,
            cart_session_id:cart_session_id,
            user_id: null
        };
        await cartModel.create(cartItemData);
    }

    const cart = await cartModel.find({}).populate({ path: 'product_id' }).exec();

    
    //Set cookie
    res.cookie('cart_session_id',  cart_session_id, {
        maxAge: 1000 * 60 * 60 * 24 * 5, // 5 days
        httpOnly: false,
        secure: false, // Change to true if using HTTPS
        sameSite: 'lax'
    });

    res.json(cart);
});


export const cartList = AsyncHandler(async (req: Request, res: Response): Promise<void> =>  {
 // Access the cart_session_id cookie
 const cartSessionId = req.cookies.cart_session_id;


 if (!cartSessionId) {
     res.status(400).json({ message: 'No cart session ID found.' });
     return;
 }

 // Calculate the total price based on cart_session_id
 const totalPrice = await cartModel.aggregate([
    {
        $match: {cart_session_id: cartSessionId,status:1}
    },
     {
         $group: {
             _id: null,
             total: { $sum: "$price" }
         }
     }
 ]);

 // Fetch all cart items for the given cart_session_id
 const allCart = await cartModel.find({ cart_session_id: cartSessionId,status:1 })
     .populate({ path: 'product_id' });
     const userId = req.session.userId;

 // Prepare the response data
 const data: any = { allCart, totalPrice: totalPrice[0]?.total || 0,userId }; // Handle case where totalPrice might be empty

 res.json(data);
})

export const incQty = AsyncHandler(async (req, res) => {
    const cartSessionId = req.cookies.cart_session_id;


    if (!cartSessionId) {
        res.status(400).json({ message: 'No cart session ID found.' });
        return;
    }
    const cartid: string = req.params.id
    const cart = await cartModel.findById({ _id: cartid }) as ICart | null;

    if (!cart) {
        res.status(404).json({ success: false, message: "Cart item not found" });
        return;
    }
    const productid = cart.product_id
    const product = await productModel.findById({ _id: productid,cart_session_id: cartSessionId }) as IProduct | null;
    if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
    const price = product.price
    const qty = cart.quantity + Number(1)
    const cartPrice = cart.price + product.price

    const cartinc = await cartModel.findOneAndUpdate({ _id: cartid }, { quantity: qty, price: cartPrice }, { new: true })
    if (cartinc) {
        let totalPrice = await cartModel.aggregate([
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
        const allCart = await cartModel.find({ cart_session_id: cartSessionId })
            .populate({ path: 'product_id' })
        const data = { allCart, totalPrice:totalPrice[0]?.total || 0 }
        res.json(data)
    }

})

export const descQty = AsyncHandler(async (req, res) => {
    const cartSessionId = req.cookies.cart_session_id;


    if (!cartSessionId) {
        res.status(400).json({ message: 'No cart session ID found.' });
        return;
    }
    const cartid = req.params.id
    const cart = await cartModel.findById({ _id: cartid })
    if (!cart) {
        res.status(404).json({ success: false, message: "Cart item not found" });
        return;
    }
    const productid = cart.product_id
    const product = await productModel.findById({ _id: productid,cart_session_id: cartSessionId})
    if (!product) {
        res.status(404).json({ success: false, message: "Product not found" });
        return;
    }
    //const price = product.price
    let allCart, data, totalPrice

    if (cart.quantity > 1) {
        const qty = cart.quantity - Number(1)
        const cartPrice = cart.price - Number(product.price)
        const cartdesc = await cartModel.findOneAndUpdate({ _id: cartid }, { quantity: qty, price: cartPrice }, { new: true })
        if (cartdesc) {
            totalPrice = await cartModel.aggregate([
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

            allCart = await cartModel.find({ cart_session_id: cartSessionId })
                .populate({ path: 'product_id' })
            const data = { allCart, totalPrice:totalPrice[0]?.total || 0 }
            res.json(data)
        }

    } else {

        totalPrice = await cartModel.aggregate([
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
        allCart = await cartModel.find({ cart_session_id: cartSessionId })
            .populate({ path: 'product_id' })

        const data = { allCart, totalPrice :totalPrice[0]?.total || 0}
        res.json(data)
    }

})

export const deleteCart = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const cartSessionId = req.cookies.cart_session_id;


        if (!cartSessionId) {
            res.status(400).json({ message: 'No cart session ID found.' });
            return;
        }
        const id: string = req.params.id;
        const cart = await cartModel.deleteOne({ _id: id });

        if (cart) {
            const totalprice = await cartModel.aggregate([
                {
                    $group: {
                        _id: null,
                        total: {
                            $sum: "$price"
                        }
                    }
                }
            ]);

            const allCart = await cartModel.find({ cart_session_id: cartSessionId }).populate({ path: 'product_id' });
            const data = { allCart, totalprice };

            res.status(200).json(data);
        }
    } catch (e) {
        res.status(500).json({
            success: false,
            error: e,
            message: "Something went wrong"
        });
    }
});

export const couponCode = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const cp: string = req.params.coupon;
        const getcoupon = await couponModel.findOne({ coupon: cp }) as ICoupon | null;

        if (!getcoupon) {
            res.status(404).json({ success: false, message: "Coupon not found" });
            return;
        }

        const totalprice = await cartModel.aggregate([
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
        let discountvalue: number;
        let discountprice: number;
        let desc: string = getcoupon.description;

        if (getcoupon.coupontype === "flat") {
            discountvalue = getcoupon.value;
            discountprice = Number(newprice[0].newprice) - discountvalue;
        } else if (getcoupon.coupontype === "percentage") {
            discountvalue = getcoupon.value;
            const percentagecalc = (discountvalue * Number(newprice[0].newprice)) / 100;
            discountprice = Number(newprice[0].newprice) - percentagecalc;
        } else {
            res.status(400).json({ success: false, message: "Invalid coupon type" });
            return;
        }

        const allcart = await cartModel.find({}).populate({ path: 'product_id' });
        const data = { allcart, totalprice, discountprice, discountvalue, desc };
        res.status(200).json(data);

    } catch (e) {
        res.status(400).json({
            success: false,
            error: e,
            message: "Something went wrong"
        });
    }
});

// Update user_id in the cart

    export const updateCartUserId = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const cartSessionId:string = req.cookies.cart_session_id; // Expect cart session ID and user ID from the client
    const cookieData: string = req.cookies.ucid;

  
    try {

        if (cookieData) {

      
        const decoded = jwt.verify(cookieData, process.env.USER_TOKEN_SECRET!) as { id: string };

        const userId = decoded.id;
     

      // Check if the user exists
      const user = await userModel.findById(userId);
      if (!user) {
         res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Update the cart items
      const updatedCart = await cartModel.updateMany(
        { cart_session_id: cartSessionId }, // Filter by session ID
        { user_id: userId } // Update user_id
      );
  
      // If no cart items were updated
      if (updatedCart.modifiedCount === 0) {
         res.status(404).json({ success: false, message: 'No cart items found for this session' });
      }
  
      // Success response
      res.status(200).json({ success: true, message: 'Cart updated successfully' });
    }else{
        res.status(404).json({ success: false, message: 'No user ID' });
    }
    } catch (error:any) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Internal Server Error', error: error.message });
    }
  });
  