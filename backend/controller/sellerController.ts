import sellerModel from "../models/sellerModel"
import slug from "slug"
import asyncHandler from "express-async-handler"
import { Request, Response } from 'express';


interface ISeller {
    name: string;
    status: number;
}

export const addSeller = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, status } = req.body

        const seller = await sellerModel.create({ name, status });
        res.status(200).send({
            success: true,
            message: "Seller added successfully",
            seller
        });
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
});

export const selerPagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let category;

    if (search) {
        category = await sellerModel.find({ name: { $regex: search, $options: "i" } }).sort([['_id', -1]]);
    } else {
        category = await sellerModel.find({}).sort([['_id', -1]]);
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
        message: "get all Color",
        results
    });
});


export const getSeller = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const seller = await sellerModel.find({});

     res.status(200).send({
        success: true,
        message: "get all sellers",
        seller
    });
});