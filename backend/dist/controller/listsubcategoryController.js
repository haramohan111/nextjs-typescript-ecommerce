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
exports.addexcelListSubCategory = exports.updateListSubCategory = exports.editlistSubCategory = exports.deletelistsubCategory = exports.ListsubcategorybyID = exports.activelistsubCategory = exports.deleteallListSubcategory = exports.getListsubcategorybyid = exports.listsubcategoryPagination = exports.managelistSubcategory = exports.addlistSubcategory = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const listSubcategoryModel_1 = __importDefault(require("../models/listSubcategoryModel"));
const slug_1 = __importDefault(require("slug"));
const subcategoryModel_1 = __importDefault(require("../models/subcategoryModel"));
const categoryModel_1 = __importDefault(require("../models/categoryModel"));
const mongoose_1 = __importDefault(require("mongoose"));
exports.addlistSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { cat_id, subcat_id, listsubcat, status } = req.body;
        const statusValue = status === "Active" ? 1 : 0;
        const check = yield listSubcategoryModel_1.default.findOne({ name: listsubcat });
        if (check) {
            res.status(400).send({
                success: false,
                message: "ListSubCategory is already added"
            });
        }
        const listsubcategory = yield listSubcategoryModel_1.default.create({
            category_id: cat_id,
            subcategory_id: subcat_id,
            name: listsubcat,
            slug: (0, slug_1.default)(listsubcat),
            status: statusValue
        });
        if (listsubcategory) {
            res.status(200).send({
                success: true,
                message: "ListSubCategory added successfully",
                listsubcategory
            });
        }
        else {
            res.status(400).send({
                success: false,
                message: "ListSubCategory addition failed"
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
exports.managelistSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listsubcategory = yield listSubcategoryModel_1.default.find({});
    res.json(listsubcategory);
}));
exports.listsubcategoryPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    let list;
    if (search) {
        list = yield listSubcategoryModel_1.default.find({ "name": { "$regex": search, "$options": "i" } })
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .sort([['_id', -1]]);
    }
    else {
        list = yield listSubcategoryModel_1.default.find({})
            .populate({ path: 'category_id' })
            .populate({ path: 'subcategory_id' })
            .sort([['_id', -1]]);
    }
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const results = {};
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
}));
exports.getListsubcategorybyid = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const listsubcategory = yield listSubcategoryModel_1.default.find({ subcategory_id: new mongoose_1.default.Types.ObjectId(id) });
    res.json(listsubcategory);
}));
exports.deleteallListSubcategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const validIds = [];
        const invalidIds = [];
        for (const id of req.body) {
            if (mongoose_1.default.Types.ObjectId.isValid(id)) {
                const document = yield listSubcategoryModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(id) });
                if (document) {
                    validIds.push(new mongoose_1.default.Types.ObjectId(id));
                }
                else {
                    invalidIds.push(id);
                }
            }
            else {
                invalidIds.push(id);
            }
        }
        if (invalidIds.length === 0) {
            const result = yield listSubcategoryModel_1.default.deleteMany({ _id: { $in: validIds } });
            if (result.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "Subcategory deleted successfully",
                    result
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
                message: "SubcategoryId is invalid",
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
exports.activelistsubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.query.id;
        const status = req.query.status;
        console.log(id, status);
        const categorycheck = yield listSubcategoryModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield listSubcategoryModel_1.default.updateOne({ _id: id }, { $set: { status: status } });
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
exports.ListsubcategorybyID = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const listsubcategory = yield listSubcategoryModel_1.default.find({ subcategory_id: new mongoose_1.default.Types.ObjectId(id) });
    res.json(listsubcategory);
}));
exports.deletelistsubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure the id is converted to an ObjectId
        const categorycheck = yield listSubcategoryModel_1.default.findOne({ _id: id });
        if (categorycheck) {
            const category = yield listSubcategoryModel_1.default.deleteOne({ _id: id });
            if (category.deletedCount !== 0) {
                res.status(200).send({
                    success: true,
                    message: "ListSubcategory deleted successfully",
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "ListSubcategory deletion failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "ListSubcategory is invalid",
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
exports.editlistSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.params.id);
    const id = req.params.id;
    const category = yield listSubcategoryModel_1.default.find({ "_id": id })
        .populate({ path: 'category_id' })
        .populate({ path: 'subcategory_id' })
        .sort([['_id', -1]]);
    res.status(200).send({
        success: true,
        message: "get listsubcategory",
        category
    });
}));
exports.updateListSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, category_id, subcategory_id, subcatename, status } = req.body;
        const categorycheck = yield listSubcategoryModel_1.default.findOne({ _id: new mongoose_1.default.Types.ObjectId(_id) });
        if (categorycheck) {
            const category = yield listSubcategoryModel_1.default.updateOne({ _id: new mongoose_1.default.Types.ObjectId(_id) }, { $set: { category_id: category_id, subcategory_id: subcategory_id, name: subcatename, status: status } });
            if (category) {
                res.status(200).send({
                    success: true,
                    message: "Listsubcategory updated successfully",
                    category
                });
            }
            else {
                res.status(400).send({
                    success: false,
                    message: "Listsubcategory update failed"
                });
            }
        }
        else {
            res.status(400).send({
                success: false,
                message: "Listsubcategory is invalid"
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
exports.addexcelListSubCategory = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = req.body;
        const itemsWithSlugs = yield Promise.all(items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            return (Object.assign(Object.assign({}, item), { category_id: (_a = (yield categoryModel_1.default.findOne({ name: item.category_id }).select('_id'))) === null || _a === void 0 ? void 0 : _a._id, subcategory_id: (_b = (yield subcategoryModel_1.default.findOne({ name: item.subcategory_id }).select('_id'))) === null || _b === void 0 ? void 0 : _b._id, name: item.listsubcategory, slug: (0, slug_1.default)(item.listsubcategory, { lower: true }) }));
        })));
        console.log(itemsWithSlugs);
        yield listSubcategoryModel_1.default.insertMany(itemsWithSlugs, { ordered: false, rawResult: true })
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
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: "Something went wrong",
            error: e.message
        });
    }
}));
