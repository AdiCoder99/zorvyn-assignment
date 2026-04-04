import express from 'express'
import { createTransaction, getAllTransactions, updateTransaction, deleteTransaction, getDeletedTransactions, restoreTransaction } from '../controllers/transactionController.js'
import { authorize } from '../middlewares/auth.js'
import { protect } from '../middlewares/protect.js'
const transactionRouter = express.Router()

transactionRouter.post('/add', protect, authorize(['admin']), createTransaction)
transactionRouter.get('/all', protect, authorize(['admin', 'analyst']), getAllTransactions)
transactionRouter.put('/update/:id', protect, authorize(['admin']), updateTransaction)
transactionRouter.delete('/delete/:id', protect, authorize(['admin']), deleteTransaction)
transactionRouter.get('/trash', protect, authorize(['admin']), getDeletedTransactions)
transactionRouter.put('/restore/:id', protect, authorize(['admin']), restoreTransaction)

export default transactionRouter;