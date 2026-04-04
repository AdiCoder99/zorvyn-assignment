import express from 'express'
import { createUser, deleteUser, getAllUsers, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { authorize } from '../middlewares/auth.js';
import { protect } from '../middlewares/protect.js';


const userRouter = express.Router();

userRouter.post('/create', protect, authorize(['admin']), createUser);
userRouter.get('/all', protect, authorize(['admin', 'analyst']), getAllUsers);
userRouter.put('/update-role/:id', protect, authorize(['admin']), updateUserRole);
userRouter.put('/update-status/:id', protect, authorize(['admin']), updateUserStatus);
userRouter.delete('/delete/:id', protect, authorize(['admin']), deleteUser)

export default userRouter;