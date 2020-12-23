import express from 'express';
import {
  authUser,
  getUserProfile,
  getUsersController,
  resetPasswordRequestTokenController,
  newPasswordResetController,
  registerUser,
  updateUserProfileController,
} from '../controllers/userController.js';
import { isAdmin } from '../middlewares/adminMiddleware.js';
import { protect } from '../middlewares/authMiddleware.js';

const userRoutes = express.Router();

//products
userRoutes.post('/login', authUser);
userRoutes.route('/profile').get(protect, getUserProfile);
userRoutes.put('/profile/:id', protect, updateUserProfileController);
userRoutes.post('/register', registerUser);
userRoutes.get('/', protect, isAdmin, getUsersController);
userRoutes.post(
  '/reset-password-request-token',
  resetPasswordRequestTokenController
);
userRoutes.post('/new-password-reset', newPasswordResetController);

export default userRoutes;
