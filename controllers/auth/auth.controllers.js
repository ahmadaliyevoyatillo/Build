const db = require("../../models")
const Auth = db.Auth

exports.registerPage = (req, res) => {
    res.render("auth/register", { title: "Регистрация" })
}

exports.registerUser = async (req, res) => {
    try {
        const { nameUser, bornDay, email, password } = req.body

        if (!email.endsWith("@gmail.com")) {
            return res.redirect("/auth/register?error=email")
        }

        if (password.length < 8) {
            return res.redirect("/auth/register?error=password")
        }

        await Auth.create({ nameUser, bornDay, email, password })

        res.redirect("/auth/login?success=1")

    } catch (error) {
        console.log(error)
    }
}


exports.loginPage = (req, res) => {
    res.render("auth/login", { title: "Вход" });
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body

    if (!email.endsWith("@gmail.com")) {
        return res.redirect("/auth/login?error=email")
    }

    if (password.length < 8) {
        return res.redirect("/auth/login?error=password")
    }

    const user = await Auth.findOne({ where: { email, password } })

    if (user) {
        req.session.user = {
            id: user.id,
            nameUser: user.nameUser,
            email: user.email,
            role: user.role
        }

        return res.redirect("/")
    }

    res.redirect("/auth/login?error=login")
}
exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/auth/login");
    });
};