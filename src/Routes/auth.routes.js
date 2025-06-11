import express from 'express'
import { AuthController } from '../Controllers/authController.js'

const authRoutes = express.Router()

authRoutes.post('/login', AuthController.login)
authRoutes.get('/logout', AuthController.logout)
authRoutes.post('/register', AuthController.register)
authRoutes.get('/verifyToken', AuthController.verifyToken)
authRoutes.post('/changePass/:id', AuthController.changePassword)
authRoutes.post('/recoverPassword/:id', AuthController.recoverPassword)
authRoutes.delete('/deleteAccount', AuthController.deleteAcount)

export default authRoutes
