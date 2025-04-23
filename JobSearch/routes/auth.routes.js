const { Router } = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const { check, validationResult } = require('express-validator')
const User = require('../models/User')
const router = Router()
router.post(
    '/register',
    [
        check('email', '������������ email').isEmail(),
        check('password', '����������� ����� ������ 5 ��������')
            .isLength({ min: 5 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: '������������ ������ ��� �����������'
                })
            }
            const { email, password, name, phone, status } = req.body
            const candidate = await User.findOne({ email })
            if (candidate) {
                return res.status(400).json({ message: '����� ������������ ��� ����������' })
            }
            const hashesPassword = await bcrypt.hash(password, 12)
            const user = new User({ email, password: hashesPassword, name, phone })
            await user.save()
            res.status(201).json({ message: '������������ ������' })
        } catch (e) {
            res.status(500).json({message: '���-�� ����� �� ���, ���������� �����'})
        }
    })

router.post(
    '/login',
    [
        check('email', '������� ���������� email').normalizeEmail().isEmail(),
        check('password', '������� ������').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: '������������ ������ ��� ����� � �������'
                })
            }

            const { email, password } = req.body
            const user = await User.findOne({ email })
            if (!user) {
                return res.status(400).json({ message: '������������ �� ������' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({message: '�������� ������'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h'}
            )

            res.json({token, userId: user.id})
        } catch (e) {
            res.status(500).json({ message: '���-�� ����� �� ���, ���������� �����' })
        }
    })

module.export = router