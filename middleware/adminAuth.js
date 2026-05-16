module.exports = (req, res, next) => {
    if (!req.session.user) {
        return res.redirect("/auth/login");
    }

    if (req.session.user.role !== "admin") {
        return res.redirect("/?error=noadmin");
    }

    req.user = req.session.user;
    next();
};
