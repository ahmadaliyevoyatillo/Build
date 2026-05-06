const db = require("../../models")
const Auth = db.Auth

exports.registerPage = (req, res) => {
    res.render("auth/register", { title: "Регистрация" })
}

exports.registerUser = async (req, res) => {
    try {
        const { nameUser, bornDay, email, password } = req.body

        await Auth.create({ nameUser, bornDay, email, password })

        res.redirect("/auth/login");

    } catch (error) {
        console.log(error);
    }
}



exports.loginPage = (req, res) => {
    res.render("auth/login", { title: "Вход" });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    const user = await Auth.findOne({ where: { email, password } })

    if (user) {
        req.session.user = {
            id: user.id,
            nameUser: user.nameUser,
            email: user.email
        }
        res.redirect("/")
    }


    else {
        res.send("Ошибка входа")
    }
}
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
};