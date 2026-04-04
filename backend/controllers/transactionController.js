import Transaction from '../models/Transaction.js';


// API to create a new transaction 
export const createTransaction = async (req, res) => {
    const { amount, type, category, date, note, userId } = req.body;
    try{
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
        const transactions = await Transaction.find().populate('createdBy', 'name email');
        res.status(200).json(transactions);
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


// API to delete a transaciton
export const deleteTransaction = async (req, res) => {
    const { id } = req.params;
    try{
        const transaction = await Transaction.findByIdAndDelete(id);
        res.status(200).json(transaction);
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
}