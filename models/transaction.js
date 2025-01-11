const mongoose = require('mongoose');


const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true, 
  },
  type: {
    type: String,
    required: true,
    enum: ['Income', 'Expense'], 
  },
  category: {
    type: String,
    required: true,  
  },
  amount: {
    type: Number,
    required: true, 
  },
  date: {
    type: Date,
    required: true, 
  },
});

module.exports = mongoose.model('Transaction', transactionSchema);
