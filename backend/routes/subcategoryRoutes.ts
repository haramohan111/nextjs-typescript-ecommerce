import express, { Request, Response, NextFunction } from 'express';
import asyncHandler from 'express-async-handler';
import {
  addSubcategory,
  getSubcategory,
  getSubcategorybyid,
  subcategoryPagination,
  deleteallSubcategory,
  addexcelSubCategory,
  activesubCategory,
  deletesubCategory,
  editSubCategory,
  updateSubCategory
} from '../controller/subcategoryController';

const router = express.Router();

router.post('/addsubcategory', (req: Request, res: Response, next: NextFunction) => addSubcategory(req, res, next));
router.get('/getsubcategory', (req: Request, res: Response, next: NextFunction) => getSubcategory(req, res, next));
router.get('/getsubcategorybyid/:id', (req: Request, res: Response, next: NextFunction) => getSubcategorybyid(req, res, next));
router.get('/subcategorypagination', (req: Request, res: Response, next: NextFunction) => subcategoryPagination(req, res, next));
router.delete('/deletesubcategory/:id', (req: Request, res: Response, next: NextFunction) => deletesubCategory(req, res, next));
router.get('/editsubcategory/:id', (req: Request, res: Response, next: NextFunction) => editSubCategory(req, res, next));
router.put('/updatesubcategory', (req: Request, res: Response, next: NextFunction) => updateSubCategory(req, res, next));

router.delete('/deleteallsubcategory', (req: Request, res: Response, next: NextFunction) => deleteallSubcategory(req, res, next));
router.post('/importexcelsubcategory', (req: Request, res: Response, next: NextFunction) => addexcelSubCategory(req, res, next));
router.put('/activesubcategory', (req: Request, res: Response, next: NextFunction) => activesubCategory(req, res, next));

export default router;
