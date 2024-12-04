"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_1 = require("../../controller/cartController");
const router = express_1.default.Router();
router.post('/addtocart/:pid/:qty', (req, res, next) => (0, cartController_1.addtocart)(req, res, next));
router.get('/cart', (req, res, next) => (0, cartController_1.cartList)(req, res, next));
router.get('/incqty/:id', (req, res, next) => (0, cartController_1.incQty)(req, res, next));
router.get('/descqty/:id', (req, res, next) => (0, cartController_1.descQty)(req, res, next));
router.get('/deletecart/:id', (req, res, next) => (0, cartController_1.deleteCart)(req, res, next));
router.get('/coupon/:coupon', (req, res, next) => (0, cartController_1.couponCode)(req, res, next));
exports.default = router;
