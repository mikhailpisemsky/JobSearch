const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME,    // ��� ���� ������
    process.env.DB_USER,    // ������������
    process.env.DB_PASSWORD, // ������
    {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        dialect: 'postgres',
        dialectModule: require('pg'), // ���� ��������� ������������ pg
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        },
        logging: false, // ��������� ���� SQL-�������� (����� �������� ��� ������)
    }
);

// �������� ����������� (�����������)
sequelize.authenticate()
    .then(() => console.log('Database connected successfully'))
    .catch(err => console.error('Unable to connect to the database:', err));

sequelize.sync()
    .then(() => console.log('Tables created successfully'))
    .catch(err => console.error('Error creating tables:', err));

module.exports = sequelize;