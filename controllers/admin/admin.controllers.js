const db = require("../../models");
const Object = db.Object;
const Auth = db.Auth;
const Rental = db.Rental;
const { Op } = require("sequelize");

const AdminDashboard = async (req, res) => {
    try {
        // Jami mahsulotlar
        const totalObjects = await Object.count();

        // Jami foydalanuvchilar
        const totalUsers = await Auth.count();

        // Jami arendalar
        const totalRentals = await Rental.count();
        const activeRentals = await Rental.count({ where: { status: "active" } });

        // Arenda qilingan mahsulotlar IDlari
        const rentedObjectIds = await Rental.findAll({
            where: { status: "active" },
            attributes: ["objectId"],
            group: ["objectId"],
            raw: true
        });
        const rentedIds = rentedObjectIds.map(r => r.objectId);

        // Sotilgan (arenda qilingan) mahsulotlar
        let soldObjects = [];
        let soldTotalPrice = 0;
        if (rentedIds.length > 0) {
            soldObjects = await Object.findAll({
                where: { id: { [Op.in]: rentedIds } },
                raw: true
            });
            soldTotalPrice = soldObjects.reduce((sum, o) => sum + (o.price || 0), 0);
        }

        // Sotilmagan mahsulotlar
        let unsoldObjects = [];
        if (rentedIds.length > 0) {
            unsoldObjects = await Object.findAll({
                where: { id: { [Op.notIn]: rentedIds } },
                raw: true
            });
        } else {
            unsoldObjects = await Object.findAll({ raw: true });
        }
        const unsoldTotalPrice = unsoldObjects.reduce((sum, o) => sum + (o.price || 0), 0);

        // Barcha mahsulotlar umumiy narxi
        const allObjects = await Object.findAll({ raw: true });
        const allTotalPrice = allObjects.reduce((sum, o) => sum + (o.price || 0), 0);

        // Oxirgi 10 mahsulot (yangilanishlar)
        const recentObjects = await Object.findAll({
            order: [["createdAt", "DESC"]],
            limit: 10,
            include: [{ model: Auth, attributes: ["nameUser", "email"] }],
            raw: true,
            nest: true
        });

        // Oxirgi 10 arenda
        const recentRentals = await Rental.findAll({
            order: [["createdAt", "DESC"]],
            limit: 10,
            include: [
                { model: Object, attributes: ["name", "price"] },
                { model: Auth, attributes: ["nameUser", "email"] }
            ],
            raw: true,
            nest: true
        });

        res.render("admin/dashboard", {
            title: "Админ Панель",
            totalObjects,
            totalUsers,
            totalRentals,
            activeRentals,
            soldCount: soldObjects.length,
            soldTotalPrice,
            unsoldCount: unsoldObjects.length,
            unsoldTotalPrice,
            allTotalPrice,
            recentObjects,
            recentRentals
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
};

const AdminStats = async (req, res) => {
    try {
        // Arenda qilingan mahsulotlar IDlari
        const rentedObjectIds = await Rental.findAll({
            where: { status: "active" },
            attributes: ["objectId"],
            group: ["objectId"],
            raw: true
        });
        const rentedIds = rentedObjectIds.map(r => r.objectId);

        // Sotilgan mahsulotlar (arenda qilingan)
        let soldObjects = [];
        let soldTotalPrice = 0;
        if (rentedIds.length > 0) {
            soldObjects = await Object.findAll({
                where: { id: { [Op.in]: rentedIds } },
                include: [{ model: Auth, attributes: ["nameUser", "email"] }],
                raw: true,
                nest: true
            });
            soldTotalPrice = soldObjects.reduce((sum, o) => sum + (o.price || 0), 0);
        }

        // Sotilmagan mahsulotlar
        let unsoldObjects = [];
        if (rentedIds.length > 0) {
            unsoldObjects = await Object.findAll({
                where: { id: { [Op.notIn]: rentedIds } },
                include: [{ model: Auth, attributes: ["nameUser", "email"] }],
                raw: true,
                nest: true
            });
        } else {
            unsoldObjects = await Object.findAll({
                include: [{ model: Auth, attributes: ["nameUser", "email"] }],
                raw: true,
                nest: true
            });
        }
        const unsoldTotalPrice = unsoldObjects.reduce((sum, o) => sum + (o.price || 0), 0);

        // Barcha mahsulotlar
        const allObjects = await Object.findAll({
            include: [{ model: Auth, attributes: ["nameUser", "email"] }],
            raw: true,
            nest: true
        });
        const allTotalPrice = allObjects.reduce((sum, o) => sum + (o.price || 0), 0);

        // Har bir arenda haqida batafsil
        const allRentals = await Rental.findAll({
            include: [
                { model: Object, attributes: ["name", "price", "image"] },
                { model: Auth, attributes: ["nameUser", "email"] }
            ],
            order: [["createdAt", "DESC"]],
            raw: true,
            nest: true
        });

        const rentalsTotalPrice = allRentals.reduce((sum, r) => sum + (r.thing ? r.thing.price || 0 : 0), 0);

        res.render("admin/stats", {
            title: "Статистика",
            soldObjects,
            soldTotalPrice,
            soldCount: soldObjects.length,
            unsoldObjects,
            unsoldTotalPrice,
            unsoldCount: unsoldObjects.length,
            allObjects,
            allTotalPrice,
            allCount: allObjects.length,
            allRentals,
            rentalsTotalPrice,
            rentalsCount: allRentals.length
        });

    } catch (error) {
        console.log(error);
        res.status(500).send("Server xatosi");
    }
};

module.exports = {
    AdminDashboard,
    AdminStats
};
