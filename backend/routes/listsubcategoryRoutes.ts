import express, { Request, Response, NextFunction } from 'express';
import {
  addlistSubcategory,
  managelistSubcategory,
  getListsubcategorybyid,
  listsubcategoryPagination,
  deleteallListSubcategory,
  addexcelListSubCategory,
  activelistsubCategory,
  deletelistsubCategory,
  editlistSubCategory,
  ListsubcategorybyID,
  updateListSubCategory
} from '../controller/listsubcategoryController';

const router = express.Router();

router.post('/addlistsubcategory', (req: Request, res: Response, next: NextFunction) => addlistSubcategory(req, res, next));
router.get('/managesubcategory', (req: Request, res: Response, next: NextFunction) => managelistSubcategory(req, res, next));
router.get('/listsubcategorypagination', (req: Request, res: Response, next: NextFunction) => listsubcategoryPagination(req, res, next));
router.post('/deletealllistsubcategory', (req: Request, res: Response, next: NextFunction) => deleteallListSubcategory(req, res, next));
router.post('/importexcellistsubcategory', (req: Request, res: Response, next: NextFunction) => addexcelListSubCategory(req, res, next));
router.put('/activelistsubcategory', (req: Request, res: Response, next: NextFunction) => activelistsubCategory(req, res, next));

router.delete('/deletelistsubcategory/:id', (req: Request, res: Response, next: NextFunction) => deletelistsubCategory(req, res, next));
router.get('/editlistsubcategory/:id', (req: Request, res: Response, next: NextFunction) => editlistSubCategory(req, res, next));

//router.get('/listsubcategorybyid/:id', (req: Request, res: Response, next: NextFunction) => ListsubcategorybyID(req, res, next));
router.put('/updatelistsubcategory', (req: Request, res: Response, next: NextFunction) => updateListSubCategory(req, res, next));

router.get('/getlistsubcategorybyid/:id', (req: Request, res: Response, next: NextFunction) => ListsubcategorybyID(req, res, next));

export default router;
