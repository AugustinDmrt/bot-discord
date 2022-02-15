const { DataTypes, Model } = require('sequelize')

module.exports = class Users extends Model {
    static init(sequelize){
        return super.init({
            userid: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true
            },
            username: { type: DataTypes.STRING },
            xp: { type: DataTypes.INTEGER }, 
            level: { type: DataTypes.INTEGER }
        }, {
            tableName: "Users",
            timestamps: true,
            sequelize
        });
    }
}