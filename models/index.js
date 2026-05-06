const {Sequelize} = require("sequelize")
require("dotenv").config()

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: "postgres",
    logging: false
})

const db = {}
db.sequelize = sequelize
db.Sequelize = Sequelize
db.Object = require("./object")(sequelize,Sequelize)
db.Auth = require("./auth")(sequelize, Sequelize)

db.Auth.hasMany(db.Object, { foreignKey: "userId" });
db.Object.belongsTo(db.Auth, { foreignKey: "userId" });
module.exports = db