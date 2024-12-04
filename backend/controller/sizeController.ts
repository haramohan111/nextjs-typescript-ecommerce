import sizeModel from "../models/sizeModel"
import slug from "slug"
import asyncHandler from "express-async-handler"
import { Request, Response } from 'express';


// Interface for Size
interface ISize {
    name: string;
    status: number;
}

export const addSize = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    try {
        // const data: ISize[] = [{
        //     name: "xl",
        //     status: 1
        // }, {
        //     name: "s",
        //     status: 1
        // }, {
        //     name: "m",
        //     status: 1
        // }, {
        //     name: "xxl",
        //     status: 1
        // }];
        const { name, status } = req.body
        const size = await sizeModel.create({ name, status});
        res.status(200).send({
            success: true,
            message: "Size added successfully",
            size
        });
    } catch (e: any) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
});

export const sizePagination = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const search: string = req.query.search as string;
    let category;

    if (search) {
        category = await sizeModel.find({ name: { $regex: search, $options: "i" } }).sort([['_id', -1]]);
    } else {
        category = await sizeModel.find({}).sort([['_id', -1]]);
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
export const getSize = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const size = await sizeModel.find({});

    res.status(200).send({
        success: true,
        message: "get all sizes",
        size
    });
});
