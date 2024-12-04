"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderController_1 = require("../../controller/orderController");
const router = express_1.default.Router();
router.post('/payment', (req, res, next) => (0, orderController_1.checkout)(req, res, next));
router.post('/paymentverify', (req, res, next) => (0, orderController_1.verifyPayment)(req, res, next));
// Uncomment this line if you want to use the createOrder route
// router.post('/createorders', (req: Request, res: Response, next: NextFunction) => createOrder(req, res, next));
exports.default = router;
