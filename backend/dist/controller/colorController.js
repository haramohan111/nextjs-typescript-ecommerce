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
exports.getColor = exports.colorPagination = exports.addColor = void 0;
const colorModel_1 = __importDefault(require("../models/colorModel"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
exports.addColor = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, status } = req.body;
        const color = yield colorModel_1.default.create({ name, status });
        res.status(200).send({
            success: true,
            message: "Color added successfully",
            color
        });
    }
    catch (e) {
        res.status(400).send({
            success: false,
            message: e.message,
            error: e.message
        });
    }
}));
exports.colorPagination = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const search = req.query.search;
    let category;
    if (search) {
        category = yield colorModel_1.default.find({ name: { $regex: search, $options: "i" } }).sort([['_id', -1]]);
    }
    else {
        category = yield colorModel_1.default.find({}).sort([['_id', -1]]);
    }
    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const lastIndex = page * limit;
    const results = {};
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
}));
exports.getColor = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const color = yield colorModel_1.default.find({});
    res.status(200).send({
        success: true,
        message: "get all brands",
        color
    });
}));
