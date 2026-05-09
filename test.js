const db = require("./models");
async function run() {
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
    console.log(JSON.stringify(rentals[0], null, 2));
    process.exit(0);
}
run();
