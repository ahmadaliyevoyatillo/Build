const db = require("../../models");
const { raw } = require("express");
const Object = db.Object

const AddObject = async (req, res) => {
    try {
        const { name, wolt, massa, price, give, userId } = req.body
        const image = req.file ? req.file.filename : null;
        if (!name || !wolt || !massa || !price || !give) {
            return res.status(400).send("Malumot to‘liq emas")
        }

        await Object.create({
            name,
            wolt,
            massa,
            price,
            give,
            image,
            userId: req.session.user.id
        })

        console.log(req.session.user)
        console.log(req.session.user.id)
        res.redirect("/")
    } catch (error) {
        console.log(error)
        res.status(500).send("Server xato")
    }
}

const GetAllObject = async (req, res) => {
    try {
        const objects = await Object.findAll({ where: {userId: req.session.user.id}, raw: true})

        res.render("home/object", { objects })
        

    } catch (error) {
        console.log(error)
        res.status(500).send("Server xato")
    }
}

const GetById = async (req, res) => {
    try {
        const id = parseInt(req.params.id)

        if (isNaN(id)) {
            return res.status(400).send("ID ")
        }

        const data = await Object.findOne({
            where: { id, userId: req.session.user.id }, raw: true
        })

        if (!data) {
            return res.status(404).send("Topilmadi")
        }

        res.render("home/arenda",  { title: "АРЕНДА" ,objects: data })

    } catch (error) {
        console.log(error)
        res.status(500).send("Server error")
    }
}

const EditPage = async (req, res) => {
    try {
        const id = req.params.id;

        const object = await Object.findOne({
            where: {
                id,
                userId: req.session.user.id
            },
            raw: true
        });

        if (!object) {
            return res.send("Topilmadi");
        }

        res.render("home/edit", {
            title: "Edit Object",
            object
        });

    } catch (error) {
        console.log(error);
        res.send("Xatolik");
    }
};

const UpdateObject = async (req, res) => {
    try {
        const id = req.params.id;

        const { name, wolt, massa, price, give } = req.body;

        const object = await Object.findOne({
            where: {
                id,
                userId: req.session.user.id
            }
        });

        if (!object) {
            return res.send("Topilmadi");
        }

        let image = object.image;

        if (req.file) {
            image = req.file.filename;
        }

        await Object.update(
            {
                name,
                wolt,
                massa,
                price,
                give,
                image
            },
            {
                where: {
                    id,
                    userId: req.session.user.id
                }
            }
        );

        res.redirect("/object");

    } catch (error) {
        console.log(error);
        res.send("Update xato");
    }
};

const DeleteObject = async (req, res) => {
    try {
        const id = req.params.id;

        const object = await Object.findOne({
            where: {
                id,
                userId: req.session.user.id
            }
        });

        if (!object) {
            return res.send("Topilmadi");
        }

        await Object.destroy({
            where: {
                id,
                userId: req.session.user.id
            }
        });

        res.redirect("/object");

    } catch (error) {
        console.log(error);
        res.send("Delete xato");
    }
};

module.exports = {
    AddObject,
    GetAllObject,
    GetById,
    EditPage,
    DeleteObject,
    UpdateObject
}