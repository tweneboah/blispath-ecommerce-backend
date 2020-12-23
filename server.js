import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import dbConnect from './config/db';
import productRoutes from './routes/productRoutes';
import { notFound, errorHandler } from './middlewares/errorMiddleware';
import userRoutes from './routes/userRoutes';
import { orderRoutes } from './routes/orderRoutes';
import { paymentRoutes } from './routes/paymentRoutes';
import { paystackWebhookRoute } from './routes/paymentWebHookRoute';
import { multerUpload } from './utils/multer';
import { cloudinaryUploadImage } from './utils/cloudinary';
import Product from './models/productModel';

dotenv.config();
dbConnect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/paystack/webhook', paystackWebhookRoute);

// app.post('/api/products', multerUpload.array('image'), async (req, res) => {
//   //Call the function we created innsole.log(reqside and pass the path of our image from multer
//   console.log(req.file);
//   console.log(req.body);
//   console.log(req.files);
//   const uploader = async path =>
//     await cloudinaryUploadImage(path, 'testing-folder');
//   console.log(req.body);
//   const urls = [];
//   const files = req.files;

//   for (const file of files) {
//     const { path } = file;
//     const newPath = await uploader(path);
//     urls.push(newPath);
//     fs.unlinkSync(path); //Delete the file from our server after uploded
//   }

//   res.status(200).json({
//     message: urls,
//   });
// });
app.get('/', (req, res) => res.json({ app: 'MERN ECOMMERCE' }));
//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () =>
  console.log(`Server is runing in ${process.env.NODE_ENV} on port ${PORT}`)
);
