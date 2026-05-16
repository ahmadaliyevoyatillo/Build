const express = require("express")
const app = express()
const session = require("express-session");
const hbs  = require("express-handlebars")
const db = require("./models")
const path = require("path")
const object = require("./models/object")
require("dotenv").config()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.engine("hbs", hbs.engine({
    extname: "hbs",
    helpers: {
        eq: function(a, b) {
            return a === b;
        },
        gt: function(a, b) {
            return a > b;
        },
        formatPrice: function(price) {
            return Number(price).toLocaleString("ru-RU");
        },
        formatDate: function(date) {
            if (!date) return "—";
            return new Date(date).toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
        },
        statusLabel: function(status) {
            if (status === "active") return "Активный";
            if (status === "cancelled") return "Отменён";
            return status;
        }
    }
}))
app.set("view engine", "hbs")
app.set("views", "./view")


app.use(session({
    secret:"secretkey",
    resave:false,
    saveUninitialized:true
}));

app.use(async (req,res,next)=>{
    res.locals.user = req.session ? req.session.user : null;
    if (res.locals.user) {
        res.locals.isAdmin = res.locals.user.role === "admin";
        try {
            res.locals.rentalsCount = await db.Rental.count({
                where: { buyerId: res.locals.user.id, status: "active" }
            });
        } catch (error) {
            console.log(error);
            res.locals.rentalsCount = 0;
        }
    }
    next();
});

app.use(express.static("public"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", require("./routes/home.routes"))
app.use("/auth", require("./routes/auth.routes"))
app.use("/admin", require("./routes/admin.routes"))




const PORT = process.env.PORT || 5700
const start = async  () => {
    try {
        await db.sequelize.sync({ alter: true });
        app.listen(PORT, () => {
            console.log(`Server ishlayapti http://localhost:${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()