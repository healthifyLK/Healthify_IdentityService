const { DataTypes } = require("sequelize");
const sequelize = require("../config/sequelize");
const bcrypt = require("bcrypt");



const User = sequelize.define('users',{
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        autoIncrement: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role:{
        type: DataTypes.ENUM('admin', 'patient','provider'),
        defaultValue: 'patient',
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
    },
},{
    tableName: 'users',
    timestamps: false,
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
    ],
});

module.exports = User;