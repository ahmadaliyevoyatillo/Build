// DB'dagi rental ma'lumotlarini tekshirish
require("dotenv").config();
const db = require("./models");

async function checkData() {
    try {
        // Barcha rentallarni ko'rish
        const rentals = await db.Rental.findAll({
            include: [{
                model: db.Object,
                include: [{
                    model: db.Auth,
                    attributes: ['email']
                }]
            }],
            raw: true,
            nest: true
        });

        console.log("=== RAW + NEST rental ma'lumotlari ===");
        console.log(JSON.stringify(rentals, null, 2));

        // Kalit nomlarini ko'rish
        if (rentals.length > 0) {
            console.log("\n=== Birinchi rental kalitlari ===");
            console.log(Object.keys(rentals[0]));
            console.log("\n=== To'liq birinchi rental ===");
            for (let key of Object.keys(rentals[0])) {
                console.log(`  ${key}:`, JSON.stringify(rentals[0][key]));
            }
        } else {
            console.log("Hech qanday rental topilmadi!");
        }

        // Barcha objectlarni ham tekshiramiz
        const objects = await db.Object.findAll({ raw: true });
        console.log("\n=== Barcha objectlar ===");
        console.log(JSON.stringify(objects, null, 2));

        process.exit(0);
    } catch (error) {
        console.error("XATO:", error);
        process.exit(1);
    }
}

checkData();
