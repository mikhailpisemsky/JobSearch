const sequelize = require('../config/db'); // ����������� ����������� ��� �� db.js

const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;

const Skill = sequelize.define('Skill', {
    skillId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    skill: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
},
    {
        tableName: 'skills',
        timestamps: false,
        createdAt: false,
    });

async function testConnection() {
    try {
        await sequelize.authenticate();
        console.log('Connection to PostgreSQL has been established successfully.');
        console.log(User === sequelize.models.Skill); // true
    } catch (error) {
        console.error('Unable to connect to the PostgreSQL database:', error);
    }
}

testConnection();

module.exports = Skill;