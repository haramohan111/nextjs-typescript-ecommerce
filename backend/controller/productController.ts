import { Request, Response } from 'express';
import productModel from "../models/productModel";
import asyncHandler from "express-async-handler";
import fs from "fs";
import mongoose from 'mongoose';
import categoryModel from '../models/categoryModel';
import Subcategory from '../models/subcategoryModel';
import Listsubcategory from '../models/listSubcategoryModel';


// Interface for Product
interface IProduct {
    category_id: mongoose.Types.ObjectId;
    subcategory_id: mongoose.Types.ObjectId;
    listsubcategory_id: mongoose.Types.ObjectId;
    name: string;
    price: number;
    countInStock: number;
    brand: string;
    size: string;
    color: string;
    seller: string;
    tags: string;
    image: string;
    description: string;
    status: number;
    stock: number;
}

export const addProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.body, 8);

    const { category_id, subcategory_id, listsubcategory_id, productname, price,
        stock, brand, size, color, seller, tags, description, status } = req.body as Omit<IProduct, 'user' | 'image' | 'countInStock' | 'name'> & { productname: string, status: string };

    if (!req.file) {
        res.status(400).json({ message: "File upload is required." });
        return;
    }
    const imgname = req.file.filename;

    const products = new productModel({
        user: new mongoose.Types.ObjectId("64b4e9326455b8ecdfa6d4ab"),
        category_id: new mongoose.Types.ObjectId(category_id),
        subcategory_id: new mongoose.Types.ObjectId(subcategory_id),
        listsubcategory_id: new mongoose.Types.ObjectId(listsubcategory_id),
        name: productname,
        price,
        countInStock: stock,
        brand,
        size,
        color,
        seller,
        tags,
        image: imgname,
        description,
        status: status === "Active" ? 1 : 0
    });

    await products.save()
        .then((response) => {
            res.status(200).send({
                success: true,
                message: "Add products successfully",
                products,
            });
        }).catch((e) => {
            res.status(400).send({
                success: false,
                message: "Error in add Product",
                error: e.message,
            });
        });

});


export const getProductsById = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const product = await productModel.findById(req.params.id as string);
    if (product) {
        res.json(product);
    } else {
        res.status(404).json('Product Not Found');
    }
});

export const getallProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await productModel.find({});
    res.json(products);
});

export const manageProducts = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const products = await productModel.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });

    res.json(products);
});

export const manageProductsPagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let products;

    if (search) {
        // products = await productModel.find({ "name": { "$regex": search, "$options": "i" } })
        //     .populate({ path: 'category_id' })
        //     .populate({ path: 'subcategory_id' })
        //     .populate({ path: 'listsubcategory_id' });

        // Step 1: Search each related model for matching names
        const categoryIds = await categoryModel.find({ name: { $regex: search, $options: 'i' } }).select('_id');
        const subcategoryIds = await Subcategory.find({ name: { $regex: search, $options: 'i' } }).select('_id');
        const listSubcategoryIds = await Listsubcategory.find({ name: { $regex: search, $options: 'i' } }).select('_id');

        // Step 2: Search in products with the filtered IDs or product description
        products = await productModel
            .find({
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { category_id: { $in: categoryIds.map((c) => c._id) } },
                    { subcategory_id: { $in: subcategoryIds.map((s) => s._id) } },
                    { listsubcategory_id: { $in: listSubcategoryIds.map((ls) => ls._id) } },
                ],
            })
            .populate('category_id')
            .populate('subcategory_id')
            .populate('listsubcategory_id');

    } else {
        products = await productModel.find({})
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .populate({ path: 'listsubcategory_id' })
            .sort([['_id', -1]]);
    }

    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results: any = {};
    results.totalUser = products.length;
    results.pageCount = Math.ceil(products.length / limit);

    if (lastIndex < products.length) {
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
    results.result = products.slice(startIndex, lastIndex);

    res.status(200).send({
        success: true,
        message: "get all products",
        results
    });
});

export const activeProduct = asyncHandler(async (req: Request, res: Response): Promise<void> =>  {
    try {

        const id = req.query.id as string;
        const status = req.query.status as string;
        console.log(id,status)
        const categorycheck = await productModel.findOne({ _id: id })
        if (categorycheck) {

            const category = await productModel.updateOne({ _id: id }, { $set: { status: status } })
            if (category) {
                    res.status(200).send({
                    success: true,
                    message: "Product status updated successfully",
                    category
                })
            } else {
                    res.status(400).send({
                    success: false,
                    message: "Product status update failed"
                })
            }
        } else {
                res.status(400).send({
                success: false,
                message: "Category is invalid"
            })
        }

    } catch (e:any) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        })
    }
});

export const deleteProduct  = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
   
        // Ensure the id is converted to an ObjectId
        const categorycheck = await productModel.findOne({ _id: id });
        
        if (categorycheck) {
            const category = await productModel.deleteOne({ _id: id });

            if (category.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "Category deleted successfully",
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Category deletion failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Category is invalid",
            });
        }

    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
});

export const deleteallProduct  = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;  // Expecting an array of IDs in the request body
  
      if (!Array.isArray(ids) || ids.length === 0) {
         res.status(400).send({
          success: false,
          message: "No categories selected for deletion",
        });
      }
  
      // Check if all the categories exist
      const categories = await productModel.find({ _id: { $in: ids } });
  
      if (categories.length !== ids.length) {
         res.status(400).send({
          success: false,
          message: "One or more categories are invalid",
        });
      }
  
      // Delete the categories from the database
      const result = await productModel.deleteMany({ _id: { $in: ids } });
  
      if (result.deletedCount > 0) {
         res.status(200).send({
          success: true,
          message: `${result.deletedCount} categories deleted successfully`,
        });
      } else {
         res.status(400).send({
          success: false,
          message: "Category deletion failed",
        });
      }
    } catch (e: any) {
      res.status(500).send({
        success: false,
        message: "Something went wrong",
        error: e.message,
      });
    }
})

export const updateProduct  = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, category_id,subcategory_id,listsubcategory_id,name,price,stock,brand,color,size,sellers,tags,description, status } = req.body as { id: string,category_id:string,subcategory_id:string,listsubcategory_id:string, name: string,price:string, stock:string, brand:string, color:string, size:string, sellers:string, tags:string, description:string,  status: number };
        const categorycheck = await productModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
        

        if (categorycheck) {
            const category = await productModel.updateOne(
                { _id: new mongoose.Types.ObjectId(id) },
                { $set: {category_id,subcategory_id,listsubcategory_id, name: name,price,stock,brand,color,size,sellers,tags,description, status: status } }
            );
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Product updated successfully",
                    category
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Product update failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Product is invalid"
            });
        }
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
});

export const editProduct  = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id)
    const id: string = req.params.id;
    const category = await productModel.findById(new mongoose.Types.ObjectId(id));

     res.status(200).send({
        success: true,
        message: "get product",
        category
    });
});
