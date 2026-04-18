/**
 * controllers/wishlistController.js
 * Get and toggle wishlist for authenticated user.
 */
const Wishlist = require('../models/Wishlist');

// GET /api/wishlist  (protected)
const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.findOne({ userId: req.user._id }).populate('productIds');
        res.json({ success: true, products: wishlist ? wishlist.productIds : [] });
    } catch (err) { next(err); }
};

// POST /api/wishlist/toggle  (protected)
// body: { productId }
const toggleWishlist = async (req, res, next) => {
    try {
        const { productId } = req.body;
        if (!productId) return res.status(400).json({ success: false, message: 'productId is required' });

        let wishlist = await Wishlist.findOne({ userId: req.user._id });
        if (!wishlist) wishlist = new Wishlist({ userId: req.user._id, productIds: [] });

        const idx = wishlist.productIds.findIndex(id => id.toString() === productId);
        let wishlisted;
        if (idx > -1) {
            wishlist.productIds.splice(idx, 1);
            wishlisted = false;
        } else {
            wishlist.productIds.push(productId);
            wishlisted = true;
        }
        await wishlist.save();
        res.json({ success: true, wishlisted, productIds: wishlist.productIds });
    } catch (err) { next(err); }
};

module.exports = { getWishlist, toggleWishlist };
