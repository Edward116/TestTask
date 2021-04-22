const {Router} = require('express')
const User = require('../model/userModel')
const jwt = require('jsonwebtoken')
const config = require('config')
const {check, validationResult} = require('express-validator')
const router = Router()


router.post(
    '/register',
    [
        check('email', 'Неправильный Email').isEmail(),
        check('password', 'Минимальная длинна пароля 8 символов')
            .isLength({min: 8}),
        check('fullName', 'Введите имя').exists(),
        check('city', 'Введите название города').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные при регистрации'
                })
            }

            const {email, password, isAdmin, fullName, city, dateOfBirth} = req.body

            const user = new User({email, password, isAdmin, fullName, city, dateOfBirth})

            await user.save()

            res.status(201).json({message: 'Пользователь создан, нажмите "Войти"'})

        } catch (e) {
            res.status(500).json({message: 'Такой пользователь уже существует'})
        }
    })
router.post(
    '/login',
    [
        check('email', 'Введите правильно email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
             const errors = validationResult(req)

            if(!errors.isEmpty()){
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некоректные данные при входе'
                })
            }

            const {email, password} = req.body

            const user = await User.findOne({email})

            if(!user) {
                return res.status(400).json({message: 'Пользователь не найден'})
            }

            const isMatch = await password === user.password

            if(!isMatch) {
                return res.status(400).json({message: 'Неверный пароль*'})
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1h' }
            )

            res.json({token, userId: user.id, admin: user.isAdmin})



        } catch (e) {
            res.status(500).json({message: 'Проблема с сервером'})
        }
})

router.get('/admin/dashboard', async (req, res) => {

})
router.get('/profile/:id', async (req, res) => {
        const {id} = req.query
        const user = await User.findOne(id)
        res.json(user)
})
router.get('/profiles', async (req, res) => {
       const users = await User.find()
        res.json(users)
})
router.put('/profiles', async (req, res) => {


})
router.delete('/profiles', async (req, res) => {

})




module.exports = router


