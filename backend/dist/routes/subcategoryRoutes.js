"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategoryController_1 = require("../controller/subcategoryController");
const router = express_1.default.Router();
router.post('/addsubcategory', (req, res, next) => (0, subcategoryController_1.addSubcategory)(req, res, next));
router.get('/getsubcategory', (req, res, next) => (0, subcategoryController_1.getSubcategory)(req, res, next));
router.get('/getsubcategorybyid/:id', (req, res, next) => (0, subcategoryController_1.getSubcategorybyid)(req, res, next));
router.get('/subcategorypagination', (req, res, next) => (0, subcategoryController_1.subcategoryPagination)(req, res, next));
router.delete('/deletesubcategory/:id', (req, res, next) => (0, subcategoryController_1.deletesubCategory)(req, res, next));
router.get('/editsubcategory/:id', (req, res, next) => (0, subcategoryController_1.editSubCategory)(req, res, next));
router.put('/updatesubcategory', (req, res, next) => (0, subcategoryController_1.updateSubCategory)(req, res, next));
router.delete('/deleteallsubcategory', (req, res, next) => (0, subcategoryController_1.deleteallSubcategory)(req, res, next));
router.post('/importexcelsubcategory', (req, res, next) => (0, subcategoryController_1.addexcelSubCategory)(req, res, next));
router.put('/activesubcategory', (req, res, next) => (0, subcategoryController_1.activesubCategory)(req, res, next));
exports.default = router;
