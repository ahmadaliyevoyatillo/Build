const db = require("./models");
async function run() {
    const objekt = await db.Object.findAll({
        include: [{
            model: db.Auth,
            attributes: ['email']
        }],
        raw: true,
        nest: true
    });
    console.log(JSON.stringify(objekt[0], null, 2));
    process.exit(0);
}
run();
