import express, { Request, Response, NextFunction } from 'express';
import { getProductsById } from '../../controller/productController';

const router = express.Router(); // Corrected from `Routes()` to `Router()`

router.get('/productsbyid/:id', (req: Request, res: Response, next: NextFunction) => getProductsById(req, res, next));

export default router;
