import express, { Request, Response, NextFunction } from 'express';
import { getProductsById, getallProducts, addProducts, manageProducts, manageProductsPagination, deleteProduct, deleteallProduct, editProduct, updateProduct, activeProduct } from '../controller/productController';
import multer from 'multer';
import path from 'path';

const router = express.Router();
// Define the storage configuration

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: (arg0: null, arg1: string) => void) => {
      cb(null, 'backend/uploads/'); // Directory where files will be stored
    },
    filename: (req: Request, file: Express.Multer.File, cb: (arg0: null, arg1: string) => void) => {
      // Create a unique filename using the current timestamp and file extension
      const fileName = Date.now() + path.extname(file.originalname);
      cb(null, fileName);
    },
  });
  
  // Initialize multer with the storage configuration
  const upload = multer({ storage });
//const upload = multer({ dest: 'backend/uploads/' });

router.post('/addproducts', upload.single('photo'), (req: Request, res: Response, next: NextFunction) => addProducts(req, res, next));
router.get('/products', (req: Request, res: Response, next: NextFunction) => getallProducts(req, res, next));
router.get('/productbyid/:id', (req: Request, res: Response, next: NextFunction) => getProductsById(req, res, next));
router.get('/manageproducts/', (req: Request, res: Response, next: NextFunction) => manageProducts(req, res, next));
router.get('/manageproductspagination/', (req: Request, res: Response, next: NextFunction) => manageProductsPagination(req, res, next));

router.delete('/deleteproduct/:id', (req: Request, res: Response, next: NextFunction) => deleteProduct(req, res, next));
router.delete('/deleteallproduct', (req: Request, res: Response, next: NextFunction) => deleteallProduct(req, res, next));
router.get('/editproduct/:id', (req: Request, res: Response, next: NextFunction) => editProduct(req, res, next));
router.put('/updateproduct', (req: Request, res: Response, next: NextFunction) => updateProduct(req, res, next));
router.put('/activeproduct', (req: Request, res: Response, next: NextFunction) => activeProduct(req, res, next));

export default router;
