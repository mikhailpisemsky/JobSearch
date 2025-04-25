const { Router } = require('express');
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../models/User'); // ������ ������ User
const router = Router();

// ����������� ������������
router.post(
    '/register',
    [
        check('email', '������������ email').isEmail(),
        check('password', '����������� ����� ������ 6 ��������').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: '������������ ������ ��� �����������'
                });
            }

            const { email, password, status } = req.body;

            // ����� ������������ � �������������� Sequelize
            const candidate = await User.findOne({ where: { email } });

            if (candidate) {
                return res.status(400).json({ message: '����� ������������ ��� ����������' });
            }

            const hashedPassword = await bcrypt.hash(password, 12);

            // �������� ������������ ����� Sequelize
            const user = await User.create({
                email,
                password: hashedPassword,
                status
            });

            await user.save()

            res.status(201).json({ message: '������������ ������' });

        } catch (e) {
            console.error('������ �����������:', e);
            res.status(500).json({ message: '���-�� ����� �� ���, ���������� �����' });
        }
    }
);
// ����������� ������������
router.post(
    '/login',
    [
        check('email', '������� ���������� email').normalizeEmail().isEmail(),
        check('password', '������� ������').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: '������������ ������ ��� ����� � �������'
                });
            }

            const { email, password } = req.body;

            // ����� ������������ ����� Sequelize
            const user = await User.findOne({ where: { email } });

            if (!user) {
                return res.status(400).json({ message: '������������ �� ������' });
            }

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: '�������� ������' });
            }

            // �������� JWT ������
            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            );

            res.json({ token, userId: user.id });

        } catch (e) {
            console.error('������ �����������:', e);
            res.status(500).json({ message: '���-�� ����� �� ���, ���������� �����' });
        }
    }
);

module.exports = router;