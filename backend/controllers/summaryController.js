import express from 'express';
import Transaction from '../models/Transaction';

// API to get the total income , expense and balance overview
export const getOverviewStats = async (req, res) => {
    try {
        const stats = await Transaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
                }
            },
            {
                $project: {
                    _id: 0,
                    totalIncome: 1,
                    totalExpense: 1,
                    balance: { $subtract: ['$totalIncome', '$totalExpense'] }
                }
            }
        ]);


        const defaultStats = { totalIncome: 0, totalExpense: 0, balance: 0 };
        res.status(200).json(stats.length > 0 ? stats[0] : defaultStats);

    } catch (error) {
        console.error("Error fetching overview stats: ", error);
        res.status(500).json({ message: 'Error fetching overview stats' });
    }
}


// API to get the summary of transactions category wise
export const getCategoryWiseTotals = async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            { 
                $group: { 
                    _id: '$category', 
                    totalIncome: { $sum: { $cond: [{ $eq: ['$type', 'income'] }, '$amount', 0] } },
                    totalExpense: { $sum: { $cond: [{ $eq: ['$type', 'expense'] }, '$amount', 0] } }
                }
            },
            { $sort: { _id: 1 } } 
        ]);
        
        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching category totals: ", error);
        res.status(500).json({ message: 'Error fetching category totals' });
    }
}

// API to get the recent transactions
export const getRecentTransactions = async (req, res) => {
    try{
        const transactions = await Transaction.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .populate('createdBy', 'name email');
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching recent transactions' })
    }
}

// API to get the summary of transaction by month 
export const getSummaryByMonth = async (req, res) => {
    try {
        const summary = await Transaction.aggregate([
            { 
                $group: {
                    _id: { month: { $month: '$date' }, year: { $year: '$date' }},
                    totalIncome: { $sum: { $cond: [ { $eq: ['$type', 'income'] }, '$amount', 0 ]}},
                    totalExpense: { $sum: { $cond: [ { $eq: ['$type', 'expense'] }, '$amount', 0 ]}}
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalIncome: 1,
                    totalExpense: 1,
                    netBalance: { $subtract: ['$totalIncome', '$totalExpense'] }
                }
            },
            { $sort: { year: -1, month: -1 } }
        ]);
        
        res.status(200).json(summary);
    } catch (error) {
        console.error("Error fetching monthly summary: ", error);
        res.status(500).json({ message: 'Error fetching summary by month' });
    }
}