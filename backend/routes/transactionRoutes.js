import express from 'express'
import { createTransaction, getAllTransactions, updateTransaction, deleteTransaction } from '../controllers/transactionController.js'
import { authorize } from '../middlewares/auth.js'
const transactionRouter = express.Router()

transactionRouter.post('/add', authorize(['admin']), createTransaction)
transactionRouter.get('/all',authorize(['admin', 'analyst']), getAllTransactions)
transactionRouter.put('/update/:id',authorize(['admin']), updateTransaction)
transactionRouter.delete('/delete/:id', authorize(['admin']), deleteTransaction)

export default transactionRouter;