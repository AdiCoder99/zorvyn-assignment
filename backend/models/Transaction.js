import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
        min: [1, "Amount must be greater than zero"]
    },
    type: {
        type: String,
        enum: {
            values: ["income", "expense"],
            message: "{VALUE} is not a supported transaction type"
        },
        required: [true, "Please specify if this is income or expense"]
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
        maxlength: [50, "Category cannot be more than 50 characters"]
    },
    date: {
        type: Date,
        required: [true, "Transaction date is required"],
        default: Date.now
    },
    note: {
        type: String,
        trim: true,
        maxlength: [200, "Note cannot be more than 200 characters"],
        required: false
    },
    // Soft Delete Fields
    isDeleted: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)

export default Transaction;
