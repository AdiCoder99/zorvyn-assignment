import express from 'express';
import { getOverviewStats, getCategoryWiseTotals, getRecentTransactions, getSummaryByMonth } from '../controllers/summaryController.js';
import { authorize } from '../middlewares/auth.js';

const summaryRouter = express.Router();

summaryRouter.get('/overview', authorize['viewer', 'analyst' ,'admin'], getOverviewStats);
summaryRouter.get('/category-wise', authorize['viewer', 'analyst' ,'admin'], getCategoryWiseTotals);
summaryRouter.get('/recent-transactions', authorize['viewer', 'analyst' ,'admin'], getRecentTransactions);
summaryRouter.get('/monthly-summary', authorize['viewer', 'analyst' ,'admin'], getSummaryByMonth);