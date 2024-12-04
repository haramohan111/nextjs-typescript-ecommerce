import express, { Request, Response, NextFunction } from 'express';
import {
  addCategory,
  getCategory,
  updateCategory,
  categoryPagination,
  manageFrontCategory,
  manageFrontlistsubCategory,
  manageFrontsubCategory,
  activeCategory,
  deleteallCategory,
  deleteCategory,
  editCategory,
  addexcelCategory
} from '../controller/categoryController';

const router = express.Router();

router.post('/addcategory', (req: Request, res: Response, next: NextFunction) => addCategory(req, res, next));
router.get('/getcategory', (req: Request, res: Response, next: NextFunction) => getCategory(req, res, next));
router.get('/categorypagination', (req: Request, res: Response, next: NextFunction) => categoryPagination(req, res, next));
router.get('/managefrontcategory', (req: Request, res: Response, next: NextFunction) => manageFrontCategory(req, res, next));
router.get('/managefrontsubcategory/:id', (req: Request, res: Response, next: NextFunction) => manageFrontsubCategory(req, res, next));
router.get('/managefrontlistsubcategory/:id', (req: Request, res: Response, next: NextFunction) => manageFrontlistsubCategory(req, res, next));
router.put('/activecategory', (req: Request, res: Response, next: NextFunction) => activeCategory(req, res, next));
router.delete('/deletecategory/:id', (req: Request, res: Response, next: NextFunction) => deleteCategory(req, res, next));
router.delete('/deleteallcategories', (req: Request, res: Response, next: NextFunction) => deleteallCategory(req, res, next));
router.get('/editcategory/:id', (req: Request, res: Response, next: NextFunction) => editCategory(req, res, next));
router.put('/updatecategory', (req: Request, res: Response, next: NextFunction) => updateCategory(req, res, next));
router.post('/importexcelcategory', (req: Request, res: Response, next: NextFunction) => addexcelCategory(req, res, next));

export default router;
