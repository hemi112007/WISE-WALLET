const express = require('express');
const Transaction = require('../models/transaction');
const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.session.user._id });

    
    const totalIncome = transactions
      .filter((t) => t.type === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter((t) => t.type === 'Expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = totalIncome - totalExpense;

    console.log('Total Income:', totalIncome);
    console.log('Total Expense:', totalExpense);
    console.log('Net Balance:', balance);

    res.render('transactions/index.ejs', { transactions, totalIncome, totalExpense, balance });
  } catch (err) {
    console.error('failed:', err);
    res.status(500).send('failed');
  }
});


router.get('/add', async (req, res) => {
  res.render('transactions/add.ejs');
});


router.post('/add', async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    const newTransaction = new Transaction({
      userId: req.session.user._id,
      type,
      category,
      amount,
      date,
    });
    await newTransaction.save();
    res.redirect('/transactions');
  } catch (err) {
    console.error('failed:', err);
    res.status(500).send('failed');
  }
});


router.get('/edit/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    if (!transaction) return res.status(404).send('Transaction not found');
    res.render('transactions/edit.ejs', { transaction });
  } catch (err) {
    console.error('failed:', err);
    res.status(500).send('faield');
  }
});


router.post('/edit/:id', async (req, res) => {
  try {
    const { type, category, amount, date } = req.body;
    await Transaction.findByIdAndUpdate(req.params.id, {
      type,
      category,
      amount,
      date,
    });
    res.redirect('/transactions');
  } catch (err) {
    console.error('failed:', err);
    res.status(500).send('failed');
  }
});

router.post('/delete/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.redirect('/transactions');
  } catch (err) {
    console.error('failed:', err);
    res.status(500).send('failed');
  }
});


module.exports = router;
