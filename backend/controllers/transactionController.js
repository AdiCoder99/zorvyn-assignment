import Transaction from '../models/Transaction.js';


// API to create a new transaction 
export const createTransaction = async (req, res) => {
    const { amount, type, category, date, note } = req.body;
    try{
        const userId = req.user._id;
        const transaction = new Transaction({
            amount,
            type,
            category,
            date,
            note,
            createdBy: userId
        })
        await transaction.save();
        res.status(201).json(transaction);
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}


// API to get all the transaction 
export const getAllTransactions = async (req, res) => {
    try{

        // Pagination
        const page = parseInt(req.query.page) || 1; 
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = { isDeleted: false };

        const transactions = await Transaction.find(filter)
        .populate('createdBy', 'name email')
        .sort({ date: -1 }) 
        .skip(skip)
        .limit(limit);

        const totalTransactions = await Transaction.countDocuments(filter);

        res.status(200).json({
            count: transactions.length,
            total: totalTransactions,
            page,
            totalPages: Math.ceil(totalTransactions / limit),
            data: transactions
        });
    }
    catch (error){
        res.status(500).json({ message:error.message })
    }
}


// API to update a transaction
export const updateTransaction = async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, date, note } = req.body;
    try{
        const transaction = await Transaction.findByIdAndUpdate(id, {
            amount,
            type,
            category,
            date,
            note
        }, { new: true });
        res.status(200).json(transaction);
    }
    catch (error){
        res.status(500).json({ message:error.message })
    }
}


// API to delete a transaciton (Soft Delete)
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try{
        const transaction = await Transaction.findByIdAndUpdate(id, 
            { 
                isDeleted: true, 
                deletedAt: Date.now() 
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ 
            message: 'Transaction deleted successfully',
            data: transaction 
        });
    }

    catch(error){
        res.status(500).json({message: error.message})
    }
}


// API to get the deleted transactions (Trash)
export const getDeletedTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ isDeleted: true })
            .populate('createdBy', 'name email')
            .sort({ deletedAt: -1 }); // Show most recently deleted first

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trash" });
    }
};

// API to restore a deleted transaction
export const restoreTransaction = async (req, res) => {
    const { id } = req.params;
    try {
        const transaction = await Transaction.findByIdAndUpdate(
            id,
            { 
                isDeleted: false, 
                deletedAt: null 
            },
            { new: true }
        );

        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.status(200).json({ 
            message: "Transaction restored successfully", 
            data: transaction 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};