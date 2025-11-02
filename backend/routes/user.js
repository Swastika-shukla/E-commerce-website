const router = require("express").Router();
const { loginUser, signupUser } = require("../controllers/user");
const { loginValidation, signupValidation } = require("../middlewares/validation");
const authenticateToken = require("../middlewares/auth");

// POST /api/users/login - User login
router.post("/login", loginValidation, loginUser);

// POST /api/users/signup - User signup
router.post("/signup", signupValidation, signupUser);

// GET /api/users/profile - Get user profile (protected route)
router.get("/profile", authenticateToken, (req, res) => {
    res.status(200).json({
        success: true,
        user: req.user
    });
});

module.exports = router;