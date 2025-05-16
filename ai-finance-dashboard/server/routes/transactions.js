const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { verifyToken } = require('../middleware/auth');

// Get all transactions
router.get('/', verifyToken, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.user.id },
            order: [['date', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single transaction
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        res.json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new transaction
router.post('/', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.create({
            ...req.body,
            userId: req.user.id
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a transaction
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        await transaction.update(req.body);
        res.json(transaction);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a transaction
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            where: {
                id: req.params.id,
                userId: req.user.id
            }
        });
        
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        
        await transaction.destroy();
        res.json({ message: 'Transaction deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
