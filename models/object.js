module.exports = (sequelize, Sequelize) => {
    const Object = sequelize.define("things", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        wolt: { 
            type: Sequelize.INTEGER,
            allowNull: false
        },
        massa: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        give: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        image: {
            type: Sequelize.STRING, 
            allowNull: true
        },
        userId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "things",
        timestamps: true
    })

    return Object
}