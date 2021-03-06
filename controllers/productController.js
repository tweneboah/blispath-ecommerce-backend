const expressAsyncHandler = require('express-async-handler');
const fs = require('fs');
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const Product = require('../models/productModel.js');
const { cloudinaryUploadImage } = require('../utils/cloudinary.js');

//Get all Products
const getProducts = asyncHandler(async (req, res) => {
  console.log(req.query.name);
  const products = await Product.find({
    name: {
      $regex: new RegExp(req.query.name && req.query.name.toLocaleLowerCase()),
    }, //Partial Search
  }).sort('-createdAt');
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

const getProductsByCategoryController = asyncHandler(async (req, res) => {
  console.log(req.query.name);
  const products = await Product.find({ category: req.body.category }).sort(
    '-createdAt'
  );
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

//Get Products by ID
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404); //You can ignore this and it will set to 500 bease on our configuration inside our error handler middleware
    //Since we have our custom middleware we can pass our own error to the error handler because we are making use of express-async-handler
    throw new Error('Product Not found');
  }
});

const createProductController = asyncHandler(async (req, res) => {
  //Get the files after multer has verify it and pass it to cloudinary
  const uploader = async fileToUpload => {
    return await cloudinaryUploadImage(fileToUpload, 'name-of-my-folder');
  };
  const urls = [];
  const files = req.files;

  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path, {
      width: 350,
      fetch_format: 'auto',
      crop: 'scale',
    });
    urls.push(newPath);
    fs.unlinkSync(path); //remove file from our storage
  }

  const product = await Product.create({
    image: urls,
    name: req.body.name.toLowerCase(),
    price: req.body.price,
    user: req.user._id,
    brand: req.body.brand,
    category: req.body.category,
    countInStock: req.body.countInStock,
    description: req.body.description,
    colors: req.body.colors,
    shoesSizes: req.body.shoesSizes,
    clothingSizes: req.body.clothingSizes,
    shippingCost: req.body.shippingCost,
    isProductNew: Date.now() + 300000, //a day
  });

  res.status(201).json(product);
});

//==================
//========UPDATE PRODUCT
//=================
const updateProductController = expressAsyncHandler(async (req, res) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );
  res.send(updatedProduct);
});

//=============================
// DELETE PRODUCT
//=====================
const deleteProductController = expressAsyncHandler(async (req, res) => {
  const deletedProduct = await Product.findByIdAndRemove(req.params.id);
  res.send(deletedProduct);
});

//===========
// FIND PRODUCT BY NAME
//==========

const findProductByNameController = expressAsyncHandler(async (req, res) => {
  const products = await Product.find({ name: req.query });
  if (products || products.length === []) {
    res.json(products);
  } else {
    throw new Error('Error occured');
  }
});

module.exports = {
  getProducts,
  getProductById,
  createProductController,
  updateProductController,
  deleteProductController,
  findProductByNameController,
  getProductsByCategoryController,
};
