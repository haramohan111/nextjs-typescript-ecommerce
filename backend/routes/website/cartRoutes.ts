import express, { Request, Response, NextFunction } from 'express';
import { addtocart, cartList, incQty, descQty, deleteCart, couponCode } from '../../controller/cartController';

const router = express.Router();

router.post('/addtocart/:pid/:qty', (req: Request, res: Response, next: NextFunction) => addtocart(req, res, next));
router.get('/cart', (req: Request, res: Response, next: NextFunction) => cartList(req, res, next));
router.get('/incqty/:id', (req: Request, res: Response, next: NextFunction) => incQty(req, res, next));
router.get('/descqty/:id', (req: Request, res: Response, next: NextFunction) => descQty(req, res, next));
router.get('/deletecart/:id', (req: Request, res: Response, next: NextFunction) => deleteCart(req, res, next));
router.get('/coupon/:coupon', (req: Request, res: Response, next: NextFunction) => couponCode(req, res, next));

export default router;
