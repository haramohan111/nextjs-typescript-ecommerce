import { Request, Response } from 'express';
import AsyncHandler from "express-async-handler";
import categoryModel from "../models/categoryModel";
import listSubcategoryModel from "../models/listSubcategoryModel";
import listsubcategoryModel from "../models/listSubcategoryModel";
import subcategoryModel from "../models/subcategoryModel";
import slug from "slug";
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';



interface ICategory {
    name: string;
    status: number;
    slug: string;
}

interface CategoryStatusUpdate {
    id: string;
    status: number;
}

interface IExCategory {
    category: string;
    name?: string;
    slug?: string;
}

export const addCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, status } = req.body as ICategory;
        const categorycheck = await categoryModel.findOne({ name });

        if (categorycheck) {
            res.status(200).send({
                success: false,
                message: "Category is already added"
            });
        }else{

       

        const category = await categoryModel.create({ name, status, slug: slug(name) });
        if (category) {
            console.log("b")
             res.status(200).send({
                success: true,
                message: "Category added successfully",
                category
            });
        } else {
            console.log("c")
             res.status(400).send({
                success: false,
                message: "Category is not added"
            });
        }
    }
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
});

export const getCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryModel.find({});
    
    res.status(200).send({
        success: true,
        message: "get all category",
        category
    });
});

export const manageFrontCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const category = await categoryModel.aggregate([
        {
            $lookup: {
                from: "subcategories",
                localField: "_id",
                foreignField: "category_id",
                as: "subcategories",
            }
        },
        {
            $unwind: "$subcategories"
        },
        {
            $lookup: {
                from: 'listsubcategories',
                localField: 'subcategories._id',
                foreignField: 'subcategory_id',
                as: 'subcategories.listsubcategories',
            },
        },
        {
            $group: {
                _id: "$_id",
                name: { $first: "$name" },
                subcategories: { $push: "$subcategories" }
            }
        }
    ]);

    res.status(200).send({
        success: true,
        message: "get all category",
        category
    });
});

export const manageFrontsubCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const subcategory = await subcategoryModel.find({ category_id: new mongoose.Types.ObjectId(id) });

     res.status(200).send({
        success: true,
        message: "get sub category",
        subcategory
    });
});

export const manageFrontlistsubCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const listsubcategory = await listsubcategoryModel.find({ category_id: new mongoose.Types.ObjectId(id) });

     res.status(200).send({
        success: true,
        message: "get all category",
        listsubcategory
    });
});

export const categoryPagination = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let category;

    if (search) {
        category = await categoryModel.find({ name: { $regex: search, $options: "i" } }).sort([['_id', -1]]);
    } else {
        category = await categoryModel.find({}).sort([['_id', -1]]);
    }

    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results: any = {};
    results.totalUser = category.length;
    results.pageCount = Math.ceil(category.length / limit);

    if (lastIndex < category.length) {
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
    results.result = category.slice(startIndex, lastIndex);

    res.status(200).send({
        success: true,
        message: "get all category",
        results
    });
});

export const activeCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> =>  {
    try {

        const id = req.query.id as string;
        const status = req.query.status as string;
        console.log(id,status)
        const categorycheck = await categoryModel.findOne({ _id: id })
        if (categorycheck) {

            const category = await categoryModel.updateOne({ _id: id }, { $set: { status: status } })
            if (category) {
                    res.status(200).send({
                    success: true,
                    message: "Category status updated successfully",
                    category
                })
            } else {
                    res.status(400).send({
                    success: false,
                    message: "Category status update failed"
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

export const deleteCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
   
        // Ensure the id is converted to an ObjectId
        const categorycheck = await categoryModel.findOne({ _id: id });
        
        if (categorycheck) {
            const category = await categoryModel.deleteOne({ _id: id });

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

export const deleteallCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
      const { ids } = req.body;  // Expecting an array of IDs in the request body
  
      if (!Array.isArray(ids) || ids.length === 0) {
         res.status(400).send({
          success: false,
          message: "No categories selected for deletion",
        });
      }
  
      // Check if all the categories exist
      const categories = await categoryModel.find({ _id: { $in: ids } });
  
      if (categories.length !== ids.length) {
         res.status(400).send({
          success: false,
          message: "One or more categories are invalid",
        });
      }
  
      // Delete the categories from the database
      const result = await categoryModel.deleteMany({ _id: { $in: ids } });
  
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

export const updateCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, name, status } = req.body as { _id: string, name: string, status: number };
        const categorycheck = await categoryModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });
        



        if (categorycheck) {
            const category = await categoryModel.updateOne(
                { _id: new mongoose.Types.ObjectId(_id) },
                { $set: { name: name, status: status } }
            );
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Category updated successfully",
                    category
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Category update failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Category is invalid"
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

export const editCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id)
    const id: string = req.params.id;
    const category = await categoryModel.findById(new mongoose.Types.ObjectId(id));

     res.status(200).send({
        success: true,
        message: "get category",
        category
    });
});


export const addexcelCategory = AsyncHandler(async (req: Request, res: Response): Promise<void> => {

    try {
        const items: IExCategory[] = req.body;

        const itemsWithSlugs = items.map(item => ({
            ...item,
            name: item.category,
            slug: slug(item.category, { lower: true })
        }));

        await categoryModel.insertMany(itemsWithSlugs, { ordered: false, rawResult: true })
            .then((result) => {
                console.log('Raw result:', result);
                res.status(200).send({
                    success: true,
                    message: "Category added successfully",
                    category: result
                });
            })
            .catch((err) => {
                console.error('Error inserting documents:', err);
                res.status(400).send({
                    success: false,
                    message: err.message
                });
            });
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
});

