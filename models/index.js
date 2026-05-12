const {Sequelize} = require("sequelize")
require("dotenv").config()

const isLocalhost = process.env.DATABASE_URL && process.env.DATABASE_URL.includes("localhost");

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    protocol: "postgres",
    dialectOptions: isLocalhost ? {} : {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
})
const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize
db.Object = require("./object")(sequelize,Sequelize)
db.Auth = require("./auth")(sequelize, Sequelize)

db.Auth.hasMany(db.Object, { foreignKey: "userId" });
db.Object.belongsTo(db.Auth, { foreignKey: "userId" });

db.Rental = require("./rental")(sequelize, Sequelize)
db.Auth.hasMany(db.Rental, { foreignKey: "buyerId" });
db.Rental.belongsTo(db.Auth, { foreignKey: "buyerId" });
db.Object.hasMany(db.Rental, { foreignKey: "objectId" });
db.Rental.belongsTo(db.Object, { foreignKey: "objectId" });

module.exports = db