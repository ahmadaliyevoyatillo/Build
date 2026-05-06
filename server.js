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

app.engine("hbs", hbs.engine({extname: "hbs"}))
app.set("view engine", "hbs")
app.set("views", "./view")


app.use(session({
    secret:"secretkey",
    resave:false,
    saveUninitialized:true
}));

app.use((req,res,next)=>{
    res.locals.user = req.session ? req.session.user : null;
    next();
});

app.use(express.static("public"))
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", require("./routes/home.routes"))
app.use("/auth", require("./routes/auth.routes"))




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