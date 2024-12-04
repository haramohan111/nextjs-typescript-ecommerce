import { Request, Response } from 'express';
import Brand from "../models/brandModel";
import slug from "slug"
import asyncHandler from "express-async-handler"

interface IBrand {
    name: string;
    status: number;
}
export const addBrand = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, status } = req.body

        const brand = await Brand.create({ name, status });
        res.status(200).send({
            success: true,
            message: "Brand added successfully",
            brand
        })
    } catch (e: unknown) {
        if (e instanceof Error) {
            res.status(400).send({
                success: false,
                message: e.message,
                error: e.message
            });
        } else {
            res.status(400).send({
                success: false,
                message: "An unknown error occurred",
                error: String(e)
            });
        }
    }
}

export const brandPagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let category;

    if (search) {
        category = await Brand.find({ name: { $regex: search, $options: "i" } }).sort([['_id', -1]]);
    } else {
        category = await Brand.find({}).sort([['_id', -1]]);
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

export const getBrand = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const brand = await Brand.find({})

    res.status(200).send({
        success: true,
        message: "get all brands",
        brand
    })
})