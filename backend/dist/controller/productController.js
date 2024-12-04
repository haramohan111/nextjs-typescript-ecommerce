"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editProduct = exports.updateProduct = exports.deleteallProduct = exports.deleteProduct = exports.activeProduct = exports.manageProductsPagination = exports.manageProducts = exports.getallProducts = exports.getProductsById = exports.addProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const mongoose_1 = __importDefault(require("mongoose"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const subcategoryModel_1 = __importDefault(require("../models/subcategoryModel"));
const listSubcategoryModel_1 = __importDefault(require("../models/listSubcategoryModel"));
exports.addProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body, 8);
    const { category_id, subcategory_id, listsubcategory_id, productname, price, stock, brand, size, color, seller, tags, description, status } = req.body;
    if (!req.file) {
        res.status(400).json({ message: "File upload is required." });
        return;
    }
    const imgname = req.file.filename;
    const products = new productModel_1.default({
        user: new mongoose_1.default.Types.ObjectId("64b4e9326455b8ecdfa6d4ab"),
        category_id: new mongoose_1.default.Types.ObjectId(category_id),
        subcategory_id: new mongoose_1.default.Types.ObjectId(subcategory_id),
        listsubcategory_id: new mongoose_1.default.Types.ObjectId(listsubcategory_id),
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
    yield products.save()
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
}));
exports.getProductsById = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield productModel_1.default.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404).json('Product Not Found');
    }
}));
exports.getallProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({});
    res.json(products);
}));
exports.manageProducts = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const products = yield productModel_1.default.find({})
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .populate({ path: 'listsubcategory_id' });
    res.json(products);
}));
exports.manageProductsPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    let products;
    if (search) {
        // products = await productModel.find({ "name": { "$regex": search, "$options": "i" } })
        //     .populate({ path: 'category_id' })
        //     .populate({ path: 'subcategory_id' })
        //     .populate({ path: 'listsubcategory_id' });
        // Step 1: Search each related model for matching names
        const categoryIds = yield categoryModel_1.default.find({ name: { $regex: search, $options: 'i' } }).select('_id');
        const subcategoryIds = yield subcategoryModel_1.default.find({ name: { $regex: search, $options: 'i' } }).select('_id');
        const listSubcategoryIds = yield listSubcategoryModel_1.default.find({ name: { $regex: search, $options: 'i' } }).select('_id');
        // Step 2: Search in products with the filtered IDs or product description
        products = yield productModel_1.default
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
    }
    else {
        products = yield productModel_1.default.find({})
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .populate({ path: 'listsubcategory_id' })
            .sort([['_id', -1]]);
    }
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const results = {};
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
}));
exports.activeProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const status = req.query.status;
        console.log(id, status);
        const categorycheck = yield productModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield productModel_1.default.updateOne({ _id: id }, { $set: { status: status } });
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Product status updated successfully",
                    category
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Product status update failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Category is invalid"
            });
        }
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
}));
exports.deleteProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure the id is converted to an ObjectId
        const categorycheck = yield productModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield productModel_1.default.deleteOne({ _id: id });
            if (category.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "Category deleted successfully",
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Category deletion failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Category is invalid",
            });
        }
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
}));
exports.deleteallProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body; // Expecting an array of IDs in the request body
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({
                success: false,
                message: "No categories selected for deletion",
            });
        }
        // Check if all the categories exist
        const categories = yield productModel_1.default.find({ _id: { $in: ids } });
        if (categories.length !== ids.length) {
            res.status(400).send({
                success: false,
                message: "One or more categories are invalid",
            });
        }
        // Delete the categories from the database
        const result = yield productModel_1.default.deleteMany({ _id: { $in: ids } });
        if (result.deletedCount > 0) {
            res.status(200).send({
                success: true,
                message: `${result.deletedCount} categories deleted successfully`,
            });
        }
        else {
            res.status(400).send({
                success: false,
                message: "Category deletion failed",
            });
        }
    }
    catch (e) {
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error: e.message,
        });
    }
}));
exports.updateProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, category_id, subcategory_id, listsubcategory_id, name, price, stock, brand, color, size, sellers, tags, description, status } = req.body;
        const categorycheck = yield productModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
        if (categorycheck) {
            const category = yield productModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(id) }, { $set: { category_id, subcategory_id, listsubcategory_id, name: name, price, stock, brand, color, size, sellers, tags, description, status: status } });
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Product updated successfully",
                    category
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Product update failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Product is invalid"
            });
        }
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
}));
exports.editProduct = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    const id = req.params.id;
    const category = yield productModel_1.default.findById(new mongoose_1.default.Types.ObjectId(id));
    res.status(200).send({
        success: true,
        message: "get product",
        category
    });
}));
