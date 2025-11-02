const express = require("express");
const router = express.Router();
const { getAllProducts, getProductById, getCategories } = require("../controllers/product");

// GET /api/products - Get all products with pagination and filtering
router.get("/", getAllProducts);

// GET /api/products/categories - Get all categories
// router.get("/categories", getCategories);

// // GET /api/products/:id - Get single product by ID
// router.get("/:id", getProductById);

module.exports = router;