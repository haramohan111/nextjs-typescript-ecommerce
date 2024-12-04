import { Request, Response } from 'express';
import productModel from "../../models/productModel";
import orderModel from "../../models/orderModel";
import asyncHandler from "express-async-handler";

import categoryModel from '../../models/categoryModel';
import Subcategory from '../../models/subcategoryModel';
import listsubcategoryModel from '../../models/listSubcategoryModel';
import wishlistModel from '../../models/wishlistModel';
import jwt from 'jsonwebtoken';
import userModel from '../../models/userModel';
import cartModel from "../../models/cartModel";

export const homeSearch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;

    // Build the search criteria
    const searchCriteria: any = {};
    if (name) {
      searchCriteria.name = { $regex: name, $options: "i" }; // Case-insensitive search
    }

    // Fetch products with the search criteria
    const products = await productModel.find(searchCriteria)
      .populate({ path: "category_id" })
      .populate({ path: "subcategory_id" })
      .populate({ path: "listsubcategory_id" });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Failed to search products", error });
  }
});

export const slider = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
    .populate({ path: 'category_id' })
    .populate({ path: 'subcategory_id' })
    .populate({ path: 'listsubcategory_id' });

  res.json(products);
});

export const productCategorySlider = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
    .populate({ path: 'category_id' })
    .populate({ path: 'subcategory_id' })
    .populate({ path: 'listsubcategory_id' });

  res.json(products);
});

export const dealofday = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const categories = ['men', 'women', 'kids', 'beauty'];

  const products = await productModel.aggregate([
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

});

export const manageProductsForMen = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
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
});

export const manageProductsForWomen = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
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
});

export const manageProductsForKids= asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
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
});

export const manageProductsForBeauty= asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
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
});

export const manageProductsForWatch = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
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
});


export const todayfav = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
    .populate({ path: 'category_id' })
    .populate({ path: 'subcategory_id' })
    .populate({ path: 'listsubcategory_id' });

  res.json(products);
});

export const productContainer = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const products = await productModel.find({})
    .populate({ path: 'category_id' })
    .populate({ path: 'subcategory_id' })
    .populate({ path: 'listsubcategory_id' });

  res.json(products);
});

export const gridListProduct = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.query;

    if (!name) {
      res.status(400).json({ message: 'Name parameter is required.' });
    }

    // Fetch the listsubcategory_id that matches the given name
    const matchingListSubcategories = await listsubcategoryModel.find({
      name: { $regex: name, $options: 'i' }, // Case-insensitive search
    });

    // Extract matching IDs
    const matchingIds = matchingListSubcategories.map((item) => item._id);

    if (matchingIds.length === 0) {
      res.status(404).json({ message: 'No matching list subcategories found.' });
    }

    // Find products with matching listsubcategory_id
    const products = await productModel.find({
      listsubcategory_id: { $in: matchingIds },
    })
      .populate({ path: 'category_id' })
      .populate({ path: 'subcategory_id' })
      .populate({ path: 'listsubcategory_id' });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: 'Failed to search products', error });
  }

});

export const getClientOrders = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
    const cookieID = req.cookies.ucid;
    if (!cookieID) {
       res.status(400).json({ message: 'ucid cookie is missing' });
    }

    const userId = await getuserID(cookieID);
    if (!userId) {
       res.status(404).json({ message: 'User not found' });
    }

    const orders = await orderModel.find({ user: userId })
    .populate({ path: 'orderItems.product_id' })
    .populate({ path: 'shippingAddress' })
    .sort({ createdAt: -1 });
    if (!orders || orders.length === 0) {
       res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json(orders);
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error?.message || 'Unknown error' });
  }
});




// Add product to the wishlist
export const addToWishlist = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const { productId } = req.body; // Get the product ID from the request body

  const cookieID = req.cookies.ucid;
  const userId = await getuserID(cookieID)

  try {
    // Check if the product exists
    const productid = await productModel.findById(productId);
    if (!productid) {
      res.status(404).json({ message: 'Product not found' });
    }

    // Find or create a wishlist for the user
    let wishlist = await wishlistModel.findOne({ userId, productId });
    if (wishlist) {

      const result = await wishlistModel.deleteOne({ userId, productId });
      // if (result.deletedCount > 0) {
      //   res.status(200).json({ success:true,message: 'Product removed from wishlist' });
      // } else {
      //   res.status(400).json({ success:true,message: 'Product not removed from wishlist' });
      // }

    } else {
      const user = await wishlistModel.create({ userId, productId });
      if (user) {
        res.status(200).json({ success:true,message: 'Product added to wishlist' });
      } else {
        res.status(400).json({ success:false,message: 'Product not added to wishlist' });
      }

    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
})


export const fetchWishList = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const cookieID = req.cookies.ucid; // Assuming a cookie named `ucid` holds user session info
  const userId = getuserID(cookieID); // Extract user ID from the cookie

  if (!userId) {
     res.status(401).json({ message: 'Unauthorized: User not logged in' });
  }

  try {
    // Fetch the wishlist items for the user
    const wishlist = await wishlistModel.find({});
    if (!wishlist.length) {
       res.status(200).json({success:false, message: 'Wishlist is empty', wishlist: [] });
    }else{
      res.status(200).json({ success:true,message: 'Wishlist fetched successfully', wishlist });
    }

  
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ success:false,message: 'Server error while fetching wishlist' });
  }
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

export const deleteCartBasedonproductId = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  try {
      const cartSessionId = req.cookies.cart_session_id;


      if (!cartSessionId) {
          res.status(400).json({ message: 'No cart session ID found.' });
          return;
      }
      const id: string = req.params.id;
      const cart = await cartModel.deleteOne({ product_id: id });

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


