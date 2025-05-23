module.exports = (sequelize, DataTypes) => {
    const StudentApplication = sequelize.define('StudentApplication', {
        applicationId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
        {
            tableName: 'students_application',
            timestamps: false,
            createdAt: false,
        });

    return StudentApplication;
};