"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controller/categoryController");
const router = express_1.default.Router();
router.post('/addcategory', (req, res, next) => (0, categoryController_1.addCategory)(req, res, next));
router.get('/getcategory', (req, res, next) => (0, categoryController_1.getCategory)(req, res, next));
router.get('/categorypagination', (req, res, next) => (0, categoryController_1.categoryPagination)(req, res, next));
router.get('/managefrontcategory', (req, res, next) => (0, categoryController_1.manageFrontCategory)(req, res, next));
router.get('/managefrontsubcategory/:id', (req, res, next) => (0, categoryController_1.manageFrontsubCategory)(req, res, next));
router.get('/managefrontlistsubcategory/:id', (req, res, next) => (0, categoryController_1.manageFrontlistsubCategory)(req, res, next));
router.put('/activecategory', (req, res, next) => (0, categoryController_1.activeCategory)(req, res, next));
router.delete('/deletecategory/:id', (req, res, next) => (0, categoryController_1.deleteCategory)(req, res, next));
router.delete('/deleteallcategories', (req, res, next) => (0, categoryController_1.deleteallCategory)(req, res, next));
router.get('/editcategory/:id', (req, res, next) => (0, categoryController_1.editCategory)(req, res, next));
router.put('/updatecategory', (req, res, next) => (0, categoryController_1.updateCategory)(req, res, next));
router.post('/importexcelcategory', (req, res, next) => (0, categoryController_1.addexcelCategory)(req, res, next));
exports.default = router;
