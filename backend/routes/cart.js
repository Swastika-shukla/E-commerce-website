const express = require("express");
const router = express.Router();
const { addToCart, getCart, removeCart, clearCart, updateCart } = require("../controllers/cart");
const { addToCartValidation, updateCartValidation, userIdParamValidation, productIdParamValidation } = require("../middlewares/validation");
const authenticateToken = require("../middlewares/auth");

// POST /api/carts/add - Add item to cart (protected)
router.post("/add", authenticateToken, addToCartValidation, addToCart);

// GET /api/carts/:userId - Get user's cart (protected)
router.get("/:userId", authenticateToken, userIdParamValidation, getCart);

// DELETE /api/carts/remove/:productId - Remove item from cart (protected)
router.delete("/remove/:productId", authenticateToken, productIdParamValidation, removeCart);

// DELETE /api/carts/clear/:userId - Clear entire cart (protected)
router.delete("/clear/:userId", authenticateToken, userIdParamValidation, clearCart);

// PUT /api/carts/update - Update cart item quantity (protected)
router.put("/update", authenticateToken, updateCartValidation, updateCart);

module.exports = router;


