// Birinchi foydalanuvchini admin qilish
require("dotenv").config();
const db = require("./models");

async function makeAdmin() {
    try {
        await db.sequelize.sync({ alter: true });
        
        // Birinchi foydalanuvchini topish
        const firstUser = await db.Auth.findOne({ order: [["id", "ASC"]] });
        
        if (firstUser) {
            await firstUser.update({ role: "admin" });
            console.log(`Foydalanuvchi "${firstUser.nameUser}" (${firstUser.email}) admin qilindi!`);
        } else {
            console.log("Hech qanday foydalanuvchi topilmadi.");
        }
        
        // Barcha foydalanuvchilarni ko'rsatish
        const allUsers = await db.Auth.findAll({ raw: true, attributes: ["id", "nameUser", "email", "role"] });
        console.log("\nBarcha foydalanuvchilar:");
        console.table(allUsers);
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

makeAdmin();
