const { log } = require("console");
const db = require("../../models");
const { raw } = require("express");
const Object = db.Object

const AddObject = async (req, res) => {
    try {
        const { name, wolt, massa, price, give } = req.body

        const image = req.file ? req.file.filename : null

        if (!name || !wolt || !massa || !price || !give) {
            return res.redirect("/object?error=missing")
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

        return res.redirect("/object?success=added")

    } catch (error) {
        console.log(error)
        return res.redirect("/object?error=server")
    }
}

const GetAllObject = async (req, res) => {
    try {
        const objects = await Object.findAll({ where: { userId: req.session.user.id }, raw: true })

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
            return res.redirect("/object?error=id")
        }

        const data = await Object.findOne({
            where: { id },
            include: [{ model: db.Auth, attributes: ['email'] }],
            raw: true,
            nest: true
        })

        if (!data) {
            return res.redirect("/object?error=notfound")
        }

        const currentUserId = req.session.user.id;
        const isOwner = data.userId === currentUserId;

        // Check if already rented by current user
        const alreadyRented = await db.Rental.findOne({
            where: { objectId: id, buyerId: currentUserId, status: "active" }
        });

        res.render("home/arenda", {
            title: "АРЕНДА",
            objects: data,
            isOwner,
            isAlreadyRented: !!alreadyRented
        })

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
            return res.redirect("/object?error=notfound")
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
            return res.redirect("/object?error=notfound")
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

        res.redirect("/object?success=updated")

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
            return res.redirect("/object?error=notfound")
        }

        await Object.destroy({
            where: {
                id,
                userId: req.session.user.id
            }
        });

        res.redirect("/object?success=deleted")

    } catch (error) {
        console.log(error);
        res.send("Delete xato");
    }
};

const GetALLall = async (req, res) => {
    try {
        const objekt = await Object.findAll({
            include: [{
                model: db.Auth,
                attributes: ['email']
            }],
            raw: true,
            nest: true
        });

        const currentUserId = req.session.user.id;

        // Get all active rentals by current user
        const myRentals = await db.Rental.findAll({
            where: { buyerId: currentUserId, status: "active" },
            raw: true
        });
        const rentedObjectIds = myRentals.map(r => r.objectId);

        objekt.forEach(item => {
            item.isOwner = item.userId === currentUserId;
            item.isAlreadyRented = rentedObjectIds.includes(item.id);
        });

        res.render("home/marketplace", { objekt })
    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
}

const Rental = db.Rental

const RentObject = async (req, res) => {
    try {
        const objectId = parseInt(req.params.id);
        const buyerId = req.session.user.id;

        if (isNaN(objectId)) {
            return res.redirect("/marketplace?error=id");
        }

        const object = await Object.findOne({ where: { id: objectId } });

        if (!object) {
            return res.redirect("/marketplace?error=notfound");
        }

        if (object.userId === buyerId) {
            return res.redirect("/marketplace?error=own");
        }

        const alreadyRented = await Rental.findOne({
            where: { objectId, buyerId, status: "active" }
        });

        if (alreadyRented) {
            return res.redirect("/my-rentals?error=already");
        }

        await Rental.create({
            objectId,
            buyerId,
            status: "active"
        });

        res.redirect("/my-rentals?success=rented");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
}

const GetMyRentals = async (req, res) => {
    try {
        const rentalsRaw = await Rental.findAll({
            where: { buyerId: req.session.user.id },
            include: [{
                model: Object,
                include: [{
                    model: db.Auth,
                    attributes: ['email']
                }]
            }]
        });

        const rentals = JSON.parse(JSON.stringify(rentalsRaw));

        res.render("home/my-rentals", { rentals });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
}

const CancelRental = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const rental = await Rental.findOne({
            where: { id, buyerId: req.session.user.id }
        });

        if (!rental) {
            return res.redirect("/my-rentals?error=notfound");
        }

        await Rental.destroy({
            where: { id, buyerId: req.session.user.id }
        });

        res.redirect("/my-rentals?success=cancelled");

    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
}

module.exports = {
    AddObject,
    GetAllObject,
    GetById,
    EditPage,
    DeleteObject,
    UpdateObject,
    GetALLall,
    RentObject,
    GetMyRentals,
    CancelRental
}