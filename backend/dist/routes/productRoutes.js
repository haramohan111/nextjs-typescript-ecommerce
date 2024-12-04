"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controller/productController");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const router = express_1.default.Router();
// Define the storage configuration
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'backend/uploads/'); // Directory where files will be stored
    },
    filename: (req, file, cb) => {
        // Create a unique filename using the current timestamp and file extension
        const fileName = Date.now() + path_1.default.extname(file.originalname);
        cb(null, fileName);
    },
});
// Initialize multer with the storage configuration
const upload = (0, multer_1.default)({ storage });
//const upload = multer({ dest: 'backend/uploads/' });
router.post('/addproducts', upload.single('photo'), (req, res, next) => (0, productController_1.addProducts)(req, res, next));
router.get('/products', (req, res, next) => (0, productController_1.getallProducts)(req, res, next));
router.get('/productbyid/:id', (req, res, next) => (0, productController_1.getProductsById)(req, res, next));
router.get('/manageproducts/', (req, res, next) => (0, productController_1.manageProducts)(req, res, next));
router.get('/manageproductspagination/', (req, res, next) => (0, productController_1.manageProductsPagination)(req, res, next));
router.delete('/deleteproduct/:id', (req, res, next) => (0, productController_1.deleteProduct)(req, res, next));
router.delete('/deleteallproduct', (req, res, next) => (0, productController_1.deleteallProduct)(req, res, next));
router.get('/editproduct/:id', (req, res, next) => (0, productController_1.editProduct)(req, res, next));
router.put('/updateproduct', (req, res, next) => (0, productController_1.updateProduct)(req, res, next));
router.put('/activeproduct', (req, res, next) => (0, productController_1.activeProduct)(req, res, next));
exports.default = router;
