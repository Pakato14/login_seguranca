const { Router } = require('express')
const UserController = require('../controllers/UsersControllers')


const router = Router()
router.get('/')
router.get('/allUser', UserController.pegaUser)
router.post('/register', UserController.cadastraUser)
router.post('/login', UserController.verificaLogin)
router.get('/user', UserController.authenticatedUser)
router.post('/logout', UserController.logout)
router.post('/reset', UserController.resetPassword)

module.exports = router