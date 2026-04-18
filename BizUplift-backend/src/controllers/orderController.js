/**
 * controllers/orderController.js
 * Place orders, view orders, update status.
 */
const Order = require('../models/Order');
const CreditLedger = require('../models/CreditLedger');
const User = require('../models/User');

// Helper: add credits
const awardCredits = async (userId, points, action) => {
    let ledger = await CreditLedger.findOne({ userId });
    if (!ledger) ledger = new CreditLedger({ userId, balance: 0, transactions: [] });
    const newBalance = ledger.balance + points;
    ledger.balance = newBalance;
    ledger.transactions.unshift({ action, points, type: 'earn', balance: newBalance });
    await ledger.save();
    await User.findByIdAndUpdate(userId, { credits: newBalance });
};

// GET /api/orders  — customers see own, sellers see their items, admin sees all
const getOrders = async (req, res, next) => {
    try {
        let orders;
        if (req.user.role === 'admin') {
            orders = await Order.find().sort('-createdAt').populate('customerId', 'name email');
        } else {
            orders = await Order.find({ customerId: req.user._id }).sort('-createdAt');
        }
        res.json({ success: true, count: orders.length, orders });
    } catch (err) { next(err); }
};

// GET /api/orders/:id
const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id).populate('customerId', 'name email');
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        // Only the customer, seller of items, or admin can view
        if (req.user.role === 'customer' && order.customerId._id.toString() !== req.user._id.toString())
            return res.status(403).json({ success: false, message: 'Not authorized' });
        res.json({ success: true, order });
    } catch (err) { next(err); }
};

// POST /api/orders
const createOrder = async (req, res, next) => {
    try {
        const { items, total, paymentMethod, address } = req.body;
        if (!items || !items.length || !total || !address)
            return res.status(400).json({ success: false, message: 'items, total and address are required' });

        const creditsEarned = Math.floor(total / 10);
        const order = await Order.create({
            customerId: req.user._id,
            items,
            total,
            paymentMethod: paymentMethod || 'COD',
            address,
            creditsEarned,
        });

        // Award loyalty credits
        await awardCredits(req.user._id, creditsEarned, 'Purchase Reward');

        res.status(201).json({ success: true, order });
    } catch (err) { next(err); }
};

// PUT /api/orders/:id/status  (seller or admin)
const updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        if (!status) return res.status(400).json({ success: false, message: 'Status is required' });

        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

        order.status = status;
        if (status === 'Delivered') order.deliveredAt = new Date();
        await order.save();

        res.json({ success: true, order });
    } catch (err) { next(err); }
};

module.exports = { getOrders, getOrder, createOrder, updateOrderStatus };
