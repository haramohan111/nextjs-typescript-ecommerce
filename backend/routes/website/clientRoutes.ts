import express, { Request, Response, NextFunction } from 'express';
import {  addToWishlist, dealofday, deleteCartBasedonproductId, fetchWishList, getClientOrders, gridListProduct, homeSearch, manageProductsForBeauty, manageProductsForKids, manageProductsForMen, manageProductsForWatch, manageProductsForWomen, productCategorySlider, productContainer, slider, todayfav } from '../../controller/frontend/homeContainer';
import { updateCartUserId } from '../../controller/cartController';
const router = express.Router();



router.get('/homesearch', (req: Request, res: Response, next: NextFunction) => homeSearch(req, res, next));

router.get('/slider', (req: Request, res: Response, next: NextFunction) => slider(req, res, next));

router.get('/productcategoryslider', (req: Request, res: Response, next: NextFunction) => productCategorySlider(req, res, next));

router.get('/dealoftheday', (req: Request, res: Response, next: NextFunction) => dealofday(req, res, next));

router.get('/manageproductformen', (req: Request, res: Response, next: NextFunction) => manageProductsForMen(req, res, next));
router.get('/manageproductforwomenmen', (req: Request, res: Response, next: NextFunction) => manageProductsForWomen(req, res, next));

router.get('/todayfav', (req: Request, res: Response, next: NextFunction) => todayfav(req, res, next));

router.get('/productcontainer', (req: Request, res: Response, next: NextFunction) => productContainer(req, res, next));
router.get('/gridlistproducts', (req: Request, res: Response, next: NextFunction) => gridListProduct(req, res, next));
router.post('/updatecartuserid', (req: Request, res: Response, next: NextFunction) => updateCartUserId(req, res, next));

router.get('/getclientorders', (req: Request, res: Response, next: NextFunction) => getClientOrders(req, res, next));

router.post('/addwishlist', (req: Request, res: Response, next: NextFunction) => addToWishlist(req, res, next));
router.get('/fetchwishlist', (req: Request, res: Response, next: NextFunction) => fetchWishList(req, res, next));

router.get('/deletecartbasedonproductid/:id', (req: Request, res: Response, next: NextFunction) => deleteCartBasedonproductId(req, res, next));


router.get('/manageproductsforkids', (req: Request, res: Response, next: NextFunction) => manageProductsForKids(req, res, next));
router.get('/manageproductsforbeauty', (req: Request, res: Response, next: NextFunction) => manageProductsForBeauty(req, res, next));
router.get('/manageproductsforwatch', (req: Request, res: Response, next: NextFunction) => manageProductsForWatch(req, res, next));

export default router;