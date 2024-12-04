import { Request, Response } from 'express';
import asyncHandler from "express-async-handler";
import listsubcategoryModel from "../models/listSubcategoryModel";
import slug from "slug";
import { ObjectId } from 'mongodb';
import subcategoryModel from "../models/subcategoryModel";
import categoryModel from "../models/categoryModel";
import mongoose from 'mongoose';

interface IListSubcategory {
    cat_id: string;
    subcat_id: string;
    listsubcat: string;
    slug: string;
    status: number | string;
}

interface IListSubcategoryItem {
    category_id: string;
    subcategory_id: string;
    listsubcategory: string;
}

export const addlistSubcategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { cat_id, subcat_id, listsubcat, status } = req.body as IListSubcategory;

        const statusValue = status === "Active" ? 1 : 0;

        const check = await listsubcategoryModel.findOne({ name: listsubcat });
        if (check) {
             res.status(400).send({
                success: false,
                message: "ListSubCategory is already added"
            });
        }

        const listsubcategory = await listsubcategoryModel.create({
            category_id: cat_id,
            subcategory_id: subcat_id,
            name: listsubcat,
            slug: slug(listsubcat),
            status: statusValue
        });

        if (listsubcategory) {
             res.status(200).send({
                success: true,
                message: "ListSubCategory added successfully",
                listsubcategory
            });
        } else {
             res.status(400).send({
                success: false,
                message: "ListSubCategory addition failed"
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

export const managelistSubcategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const listsubcategory = await listsubcategoryModel.find({});
    res.json(listsubcategory);
});

export const listsubcategoryPagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let list;

    if (search) {
        list = await listsubcategoryModel.find({ "name": { "$regex": search, "$options": "i" } })
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .sort([['_id', -1]]);
    } else {
        list = await listsubcategoryModel.find({})
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .sort([['_id', -1]]);
    }

    const page: number = parseInt(req.query.page as string);
    const limit: number = parseInt(req.query.limit as string);

    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;

    const results: any = {};
    results.totalUser = list.length;
    results.pageCount = Math.ceil(list.length / limit);

    if (lastIndex < list.length) {
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
    results.result = list.slice(startIndex, lastIndex);

    res.status(200).send({
        success: true,
        message: "get all Listsubcategory",
        results
    });
});

export const getListsubcategorybyid = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const listsubcategory = await listsubcategoryModel.find({ subcategory_id: new mongoose.Types.ObjectId(id) });
    res.json(listsubcategory);
});

export const deleteallListSubcategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body);
        const validIds: mongoose.Types.ObjectId[] = [];
        const invalidIds: string[] = [];

        for (const id of req.body) {
            if (mongoose.Types.ObjectId.isValid(id)) {
                const document = await listsubcategoryModel.findOne({ _id: new mongoose.Types.ObjectId(id) });
                if (document) {
                    validIds.push(new mongoose.Types.ObjectId(id));
                } else {
                    invalidIds.push(id);
                }
            } else {
                invalidIds.push(id);
            }
        }

        if (invalidIds.length === 0) {
            const result = await listsubcategoryModel.deleteMany({ _id: { $in: validIds } });
            if (result.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "Subcategory deleted successfully",
                    result
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Subcategory deletion failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "SubcategoryId is invalid",
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

export const activelistsubCategory = asyncHandler(async (req: Request, res: Response): Promise<void> =>  {
    try {

        const id = req.query.id as string;
        const status = req.query.status as string;
        console.log(id,status)
        const categorycheck = await listsubcategoryModel.findOne({ _id: id })
        if (categorycheck) {

            const category = await listsubcategoryModel.updateOne({ _id: id }, { $set: { status: status } })
            if (category) {
                    res.status(200).send({
                    success: true,
                    message: "Subcategory status updated successfully",
                    category
                })
            } else {
                    res.status(400).send({
                    success: false,
                    message: "Subcategory status update failed"
                })
            }
        } else {
                res.status(400).send({
                success: false,
                message: "Subcategory is invalid"
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

export const ListsubcategorybyID = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const id: string = req.params.id;
    const listsubcategory = await listsubcategoryModel.find({ subcategory_id: new mongoose.Types.ObjectId(id) });
    res.json(listsubcategory);
});

export const deletelistsubCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
   
        // Ensure the id is converted to an ObjectId
        const categorycheck = await listsubcategoryModel.findOne({ _id: id });
        
        if (categorycheck) {
            const category = await listsubcategoryModel.deleteOne({ _id: id });

            if (category.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "ListSubcategory deleted successfully",
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "ListSubcategory deletion failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "ListSubcategory is invalid",
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


export const editlistSubCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    console.log(req.params.id)
    const id: string = req.params.id;

    const category = await listsubcategoryModel.find({ "_id":id})
    .populate({ path: 'category_id' })
    .populate({ path: 'subcategory_id' })
    .sort([['_id', -1]]);
     res.status(200).send({
        success: true,
        message: "get listsubcategory",
        category
    });
});

export const updateListSubCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { _id, category_id,subcategory_id,subcatename, status } = req.body as { _id: string,category_id:string,subcategory_id:string, subcatename: string, status: number };
        const categorycheck = await listsubcategoryModel.findOne({ _id: new mongoose.Types.ObjectId(_id) });
        
        if (categorycheck) {
            const category = await listsubcategoryModel.updateOne(
                { _id: new mongoose.Types.ObjectId(_id) },
                { $set: { category_id:category_id,subcategory_id:subcategory_id ,name: subcatename, status: status } }
            );
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Listsubcategory updated successfully",
                    category
                });
            } else {
                res.status(400).send({
                    success: false,
                    message: "Listsubcategory update failed"
                });
            }
        } else {
            res.status(400).send({
                success: false,
                message: "Listsubcategory is invalid"
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

export const addexcelListSubCategory = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const items: IListSubcategoryItem[] = req.body;
        
        const itemsWithSlugs = await Promise.all(items.map(async (item) => ({
            ...item,
            category_id: (await categoryModel.findOne({ name: item.category_id }).select('_id'))?._id,
            subcategory_id: (await subcategoryModel.findOne({ name: item.subcategory_id }).select('_id'))?._id,
            name: item.listsubcategory,
            slug: slug(item.listsubcategory, { lower: true })
        })));

        console.log(itemsWithSlugs);

        await listsubcategoryModel.insertMany(itemsWithSlugs, { ordered: false, rawResult: true })
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
  