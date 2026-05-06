const router = require("express").Router();
const db = require("../models");
const Object = db.Object;
const Auth = db.Auth
const uploads = require("../middleware/upload");
const isAuth = require("../middleware/auth");

const { AddObject, GetById, EditPage } = require("../controllers/home/home.controllers");
const auth = require("../models/auth");

router.get("/", isAuth, async (req, res) => {
    const objects = await Object.findAll({
        where: { userId: req.session.user.id },
        raw: true
    });

    res.render("home/home", {
        title: "Главная",
        objects,
        user: req.session.user
    });
});
router.get("/", (req,res) => {
    res.render("partials/navbar", {auth})
})
router.get("/object", isAuth, async (req, res) => {
    const objects = await Object.findAll({
        where: { userId: req.session.user.id },
        raw: true
    });

    res.render("home/object", {
        title: "Объекты",
        objects
    });
});

router.get("/add", isAuth, (req, res) => {
    res.render("home/add", {
        title: "Добавить объект"
    });
});

router.post("/add", isAuth, uploads.single("image"), AddObject);

router.get("/object/:id", isAuth, GetById);

router.get("/about", isAuth, (req,res)=>{
    res.render("home/about");
});

router.get("/video", isAuth, (req,res)=>{
    res.render("home/video");
});

router.get("/edit", EditPage)

router.get("/contact", isAuth, (req,res)=>{
    res.render("home/contact");
});


module.exports = router;