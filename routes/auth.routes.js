const {registerPage,registerUser, loginPage, loginUser, logout} = require("../controllers/auth/auth.controllers");
const router = require("express").Router()


router.get("/register", registerPage);
router.get("/logout", logout)
router.get("/login", loginPage);

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout)

module.exports = router