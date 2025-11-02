const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, 'User ID is required']
    },
    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Product", 
                required: [true, 'Product ID is required']
            },
            quantity: { 
                type: Number, 
                required: [true, 'Quantity is required'],
                min: [1, 'Quantity must be at least 1'],
                default: 1
            }
        }
    ]
}, { 
    timestamps: true 
});

// Index for faster cart lookups
cartSchema.index({ userId: 1 });

// Virtual for total items count
cartSchema.virtual('totalItems').get(function() {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;