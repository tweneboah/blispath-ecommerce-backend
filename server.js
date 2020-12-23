import cors from 'cors';
import express from 'express';

import dotenv from 'dotenv';
// import dbConnect from './config/db';

// import productRoutes from './routes/productRoutes';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import { orderRoutes } from './routes/orderRoutes.js';
import { paymentRoutes } from './routes/paymentRoutes.js';
import { paystackWebhookRoute } from './routes/paymentWebHookRoute.js';
import { connectDb } from './config/connectDb.js';
import productRoutes from './routes/productRoutes.js';
const app = express();
dotenv.config();
connectDb();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/pay', paymentRoutes);
app.use('/paystack/webhook', paystackWebhookRoute);

app.get('/', (req, res) => res.json({ app: 'MERN ECOMMERCE' }));
//Error Handler
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>
  console.log(`Server is runing in ${process.env.NODE_ENV} on port ${PORT}`)
);
