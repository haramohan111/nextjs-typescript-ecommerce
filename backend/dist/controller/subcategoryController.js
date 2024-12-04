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
exports.addexcelSubCategory = exports.updateSubCategory = exports.editSubCategory = exports.deletesubCategory = exports.activesubCategory = exports.deleteallSubcategory = exports.getSubcategorybyid = exports.subcategoryPagination = exports.getSubcategory = exports.addSubcategory = void 0;
const slug_1 = __importDefault(require("slug"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const subcategoryModel_1 = __importDefault(require("../models/subcategoryModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.addSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { category_id, subcatename, status } = req.body;
    console.log(req.body);
    const subcategoryStatus = status === "Active" ? 1 : 0;
    const subcategory = yield subcategoryModel_1.default.create({
        category_id: category_id,
        name: subcatename,
        slug: (0, slug_1.default)(subcatename),
        status: subcategoryStatus
    });
    res.status(200).send({
        success: true,
        message: "subcategory added successfully",
        subcategory
    });
}));
exports.getSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subcategory = yield subcategoryModel_1.default.find({});
    res.status(200).send({
        success: true,
        message: "get all subcategory",
        subcategory
    });
}));
exports.subcategoryPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    let subcategory;
    if (search) {
        subcategory = yield subcategoryModel_1.default.find({ "name": { "$regex": search, "$options": "i" } })
            .populate({ path: 'category_id' })
            .sort([['_id', -1]]);
    }
    else {
        subcategory = yield subcategoryModel_1.default.find({})
            .populate({ path: 'category_id' })
            .sort([['_id', -1]]);
    }
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const results = {};
    results.totalUser = subcategory.length;
    results.pageCount = Math.ceil(subcategory.length / limit);
    if (lastIndex < subcategory.length) {
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
    results.result = subcategory.slice(startIndex, lastIndex);
    res.status(200).send({
        success: true,
        message: "get all subcategory",
        results
    });
}));
exports.getSubcategorybyid = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    if (id !== null) {
        const subcategory = yield subcategoryModel_1.default.find({ category_id: id });
        res.json(subcategory);
    }
    else {
        res.status(400).send({
            success: false,
            message: "Invalid category ID"
        });
    }
}));
exports.deleteallSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ids } = req.body; // Expecting an array of IDs in the request body
        if (!Array.isArray(ids) || ids.length === 0) {
            res.status(400).send({
                success: false,
                message: "No categories selected for deletion",
            });
        }
        // Check if all the categories exist
        const categories = yield subcategoryModel_1.default.find({ _id: { $in: ids } });
        if (categories.length !== ids.length) {
            res.status(400).send({
                success: false,
                message: "One or more categories are invalid",
            });
        }
        // Delete the categories from the database
        const result = yield subcategoryModel_1.default.deleteMany({ _id: { $in: ids } });
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
exports.activesubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const status = req.query.status;
        console.log(id, status);
        const categorycheck = yield subcategoryModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield subcategoryModel_1.default.updateOne({ _id: id }, { $set: { status: status } });
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Subcategory status updated successfully",
                    category
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Subcategory status update failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Subcategory is invalid"
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
exports.deletesubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure the id is converted to an ObjectId
        const categorycheck = yield subcategoryModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield subcategoryModel_1.default.deleteOne({ _id: id });
            if (category.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "Subcategory deleted successfully",
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Subcategory deletion failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Subcategory is invalid",
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
exports.editSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    const id = req.params.id;
    const category = yield subcategoryModel_1.default.find({ "_id": id })
        .populate({ path: 'category_id' })
        .sort([['_id', -1]]);
    res.status(200).send({
        success: true,
        message: "get subcategory",
        category
    });
}));
exports.updateSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, category_id, subcatename, status } = req.body;
        const categorycheck = yield subcategoryModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(_id) });
        if (categorycheck) {
            const category = yield subcategoryModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(_id) }, { $set: { category_id: category_id, name: subcatename, status: status } });
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Category updated successfully",
                    category
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Category update failed"
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
            message: "Something went wrong",
            error: e.message
        });
    }
}));
exports.addexcelSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body;
        const itemsWithSlugs = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            return (Object.assign(Object.assign({}, item), { category_id: (_a = (yield categoryModel_1.default.findOne({ name: item.category_id }).select('_id'))) === null || _a === void 0 ? void 0 : _a._id, name: item.subcategory, slug: (0, slug_1.default)(item.subcategory, { lower: true }) }));
        })));
        yield subcategoryModel_1.default.insertMany(itemsWithSlugs, { ordered: false, rawResult: true })
            .then((result) => {
            console.log('Raw result:', result);
            res.status(200).send({
                success: true,
                message: "Subcategories added successfully",
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
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
}));
