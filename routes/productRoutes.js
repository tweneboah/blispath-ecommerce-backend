import express from 'express';
import {
  createProductController,
  deleteProductController,
  fileUploadController,
  findProductByNameController,
  getProductById,
  getProducts,
  updateProductController,
} from '../controllers/productController';
import { isAdmin } from '../middlewares/adminMiddleware';
import { protect } from '../middlewares/authMiddleware';
import { multerUpload } from '../utils/multer';
const productRoutes = express.Router();

//products
productRoutes.route('/').get(getProducts);
productRoutes.route('/find').get(findProductByNameController);
productRoutes.post(
  '/',
  multerUpload.array('image'),
  protect,
  isAdmin,
  createProductController
);

productRoutes.post('/file', fileUploadController);
productRoutes.route('/:id').get(getProductById);
productRoutes.put('/update/:id', updateProductController);
productRoutes.delete('/delete/:id', deleteProductController);
export default productRoutes;
