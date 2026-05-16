const router = require("express").Router();
const isAdmin = require("../middleware/adminAuth");
const { AdminDashboard, AdminStats } = require("../controllers/admin/admin.controllers");

router.get("/", isAdmin, AdminDashboard);
router.get("/stats", isAdmin, AdminStats);

module.exports = router;
