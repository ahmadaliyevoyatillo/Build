module.exports = (sequelize, Sequelize) => {
    return sequelize.define("rental", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        objectId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        buyerId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        status: {
            type: Sequelize.STRING,
            defaultValue: "active"
        }
    },
        {
            tableName: "rentals",
            timestamps: true
        })
}
