const Cart = require("../models/cart");
const Product = require("../models/product");

async function addToCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: "Product not found" 
      });
    }

    // Check if cart exists for the user
    let cart = await Cart.findOne({ userId });

    if (cart) {
      // Check if product already exists in items
      const existingItem = cart.items.find(
        item => item.productId.toString() === productId
      );

      if (existingItem) {
        // Update quantity if product already exists
        existingItem.quantity += 1;
      } else {
        // Add new product to items array
        cart.items.push({ productId, quantity });
      }

      await cart.save();
      
      // Populate product details
      await cart.populate('items.productId');
      
      res.status(200).json({ 
        success: true,
        message: "Cart updated successfully", 
        data: cart 
      });
    } else {
      // Create new cart
      const newCart = new Cart({
        userId,
        items: [{ productId, quantity }]
      });

      await newCart.save();
      await newCart.populate('items.productId');

      res.status(201).json({ 
        success: true,
        message: "Cart created successfully", 
        data: newCart 
      });
    }
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false,
      message: "Failed to update cart",
      error: error.message 
    });
  }
}

async function getCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId');

    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (err) {
    console.error('Get cart error:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to fetch cart",
      error: err.message 
    });
  }
}

async function removeCart(req, res) {
  try {
    const { userId } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    // Remove item from embedded items array
    cart.items = cart.items.filter(
      item => item.productId.toString() !== productId
    );
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ 
      success: true,
      message: "Item removed successfully", 
      data: cart 
    });
  } catch (err) {
    console.error("Remove cart item error:", err);
    res.status(500).json({ 
      success: false,
      message: "Failed to remove item",
      error: err.message 
    });
  }
}

async function clearCart(req, res) {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId });

    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: "Cart not found" 
      });
    }

    // Clear embedded items
    cart.items = [];
    await cart.save();

    res.status(200).json({ 
      success: true,
      message: "Cart cleared successfully", 
      data: cart 
    });
  } catch (err) {
    console.error('Clear cart error:', err);
    res.status(500).json({ 
      success: false,
      message: "Failed to clear cart",
      error: err.message 
    });
  }
}

async function updateCart(req, res) {
  try {
    const { userId, productId, quantity } = req.body;

    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid quantity value' 
      });
    }

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false,
        message: 'Item not found in cart' 
      });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    await cart.populate('items.productId');

    res.status(200).json({ 
      success: true,
      message: 'Cart updated successfully', 
      data: cart 
    });
  } catch (error) {
    console.error('Cart update error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update cart', 
      error: error.message 
    });
  }
}

module.exports = { addToCart, getCart, removeCart, clearCart, updateCart };