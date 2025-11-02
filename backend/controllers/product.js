const Product = require("../models/product");
 
// GET /api/products with pagination, filtering, and sorting
async function getAllProducts(req, res) {
  try {
   
     const products = await Product.find(); // No filters, no pagination
    res.json({ success: true, data: products });
  } catch (err) {
    console.error('Product fetch error:', err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: err.message
    });
  }
}
 
 
 
module.exports = {
  getAllProducts,
};