const router = require("express").Router();
const db = require("../models");
const Object = db.Object;
const Auth = db.Auth
const uploads = require("../middleware/upload");
const isAuth = require("../middleware/auth");

const { AddObject, GetById, EditPage, DeleteObject, UpdateObject, GetALLall, RentObject, GetMyRentals, CancelRental } = require("../controllers/home/home.controllers");
router.get("/", isAuth, async (req, res) => {
    const rentalCount = await db.Rental.count({
        where: {
            buyerId: req.session.user.id
        }
    });

    const objects = await Object.findAll({
        where: { userId: req.session.user.id },
        raw: true
    });

    res.render("home/home", {
        title: "Главная",
        objects,
        user: req.session.user,
        rentalCount
    });
});

router.get("/object", isAuth, async (req, res) => {
    const objects = await Object.findAll({
        raw: true,
        nest: true,
        include: [{
            model: Auth,
            attributes: ['email']
        }]
    });

    objects.forEach(item => {
        item.isOwner = item.userId === req.session.user.id;
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

router.get("/edit/:id", isAuth, EditPage)

router.post("/edit/:id", isAuth, uploads.single("image"), UpdateObject)

router.get("/delete/:id", isAuth, DeleteObject)

router.get("/contact", isAuth, (req,res)=>{
    res.render("home/contact");
});


router.get("/marketplace", isAuth, GetALLall);

router.get("/rent/:id", isAuth, RentObject);

router.get("/my-rentals", isAuth, GetMyRentals);

router.get("/cancel-rental/:id", isAuth, CancelRental);


module.exports = router;