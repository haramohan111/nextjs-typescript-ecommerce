import express, { Request, Response, NextFunction } from 'express';
import { checkout, verifyPayment } from '../../controller/orderController';

const router = express.Router();

router.post('/payment', (req: Request, res: Response, next: NextFunction) => checkout(req, res, next));
router.post('/paymentverify', (req: Request, res: Response, next: NextFunction) => verifyPayment(req, res, next));

// Uncomment this line if you want to use the createOrder route
// router.post('/createorders', (req: Request, res: Response, next: NextFunction) => createOrder(req, res, next));

export default router;
