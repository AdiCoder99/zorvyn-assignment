import express from 'express'
import { createUser, deleteUser, getAllUsers, updateUserRole, updateUserStatus } from "../controllers/userController.js";
import { authorize } from '../middlewares/auth.js';


const userRouter = express.Router();

userRouter.post('/create', authorize(['admin']), createUser);
userRouter.get('/all', authorize(['admin', 'analyst', 'viewer']), getAllUsers);
userRouter.put('/update-role/:id', authorize(['admin']), updateUserRole);
userRouter.put('/update-status/:id', authorize(['admin']), updateUserStatus);
userRouter.delete('/delete/:id', authorize(['admin']), deleteUser)

export default userRouter;