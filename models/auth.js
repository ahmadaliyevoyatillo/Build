module.exports = (sequelize, Sequelize) => {
    return sequelize.define("user", {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nameUser: {
            type: Sequelize.STRING,
            allowNull: false
        },
        bornDay: {
            type: Sequelize.DATE,
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false
        }
    },
        {
            tableName: "users",
            timestamps: true
        })
}