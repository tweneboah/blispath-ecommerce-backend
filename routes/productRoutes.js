const express = require('express');
const {
  createProductController,
  deleteProductController,
  findProductByNameController,
  getProductById,
  getProducts,
  updateProductController,
} = require('../controllers/productController.js');
const { isAdmin } = require('../middlewares/adminMiddleware.js');
const { protect } = require('../middlewares/authMiddleware.js');
const { multerUpload } = require('../utils/multer.js');
const productRoutes = express.Router();

//products
productRoutes.route('/').get(getProducts);
productRoutes.route('/find').get(findProductByNameController);
//Upload image and attach the urls to the product and save to DB
productRoutes.post(
  '/',
  multerUpload.array('image'),
  protect,
  isAdmin,
  createProductController
);

productRoutes.route('/:id').get(getProductById);
productRoutes.put('/update/:id', updateProductController);
productRoutes.delete('/delete/:id', deleteProductController);
module.exports = productRoutes;
