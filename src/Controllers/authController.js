import User from '../Models/User.js'
import { verificationIfExistUser, verificationLoginUser } from '../Utils/Auth/verificationIfUser.js'
import { verificationUserData } from '../Utils/Auth/verificationUser.js'
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config.js'
import bcrypt from 'bcryptjs'

export class AuthController {
  static async getUsers (req, res) { // to do getUsers tiene que devolver los usuarios que estan dentro de una lista
    try {
      const users = await User.find()
      if (!users) return res.status(404).json({ message: 'Error al encontrar usuarios', users, status: false })
      const newUsers = users.map((user) => {
        return ({
          _id: user._id,
          nombre: user.nombre,
          email: user.email
        })
      })
      // console.log(newUsers)
      res.json({ users: newUsers, status: true })
    } catch (error) {
      console.error(error)
      res.status(404).json({ message: 'Error al encontrar usuarios' })
    }
  }

  static async login (req, res) {
    // to do
    const { email, pass } = req.body

    try {
      const acceptedUser = await verificationLoginUser({ email, pass })

      if (!acceptedUser.status) return res.json({ message: acceptedUser.message, status: acceptedUser.status })
      console.log('Activo')
      if (acceptedUser.status) {
        const token = jwt.sign({
          id: acceptedUser.user.id,
          nombre: acceptedUser.user.nombre,
          email: acceptedUser.user.email
        },
        JWT_KEY, {
          expiresIn: '1h'
          // expiresIn: '15s'
        })

        // Guardar el token en una cookie HTTP Only
        res.cookie('token', token, {
          // httpOnly: true, // evita acceso desde JS del cliente
          // secure: process.env.NODE_ENV === 'production', // sólo en HTTPS en producción
          sameSite: 'strict', // previene CSRF
          maxAge: 3600000 // 1 hora
          // maxAge: 15000
        }).json({
          message: 'Sesion Iniciada con exito',
          user: {
            id: acceptedUser.user.id,
            nombre: acceptedUser.user.nombre,
            email: acceptedUser.user.email
          },
          status: true
        })
      }
    } catch (error) {
      console.error(error)
      res.status(404).json({ message: 'Error al iniciar sesion' })
    }
  }

  static async logout (req, res) {
    const { token } = req.cookies
    try {
      jwt.verify(token, JWT_KEY, async (err, user) => {
        if (err) return res.status(401).json({ message: 'No hay token para verificar usuario', status: false })

        const usuario = await User.findById(user.id)
        if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado al cerrar sesion', status: false })

        usuario.activo = false
        usuario.save()
      })
      res.clearCookie('token', {
        sameSite: 'strict'
      })
      res.json({ message: 'sesion cerrada', status: true })
    } catch (error) {
      console.error(error)
      res.status(404)
    }
  }

  static async register (req, res) {
    // to do
    const { nombre, pass, email } = req.body

    const dataVerificada = verificationUserData({ nombre, pass, email })
    if (!dataVerificada.status) return res.json({ message: 'Error data verificada', error: dataVerificada.message })

    try {
      if (!verificationIfExistUser({ email })) return res.json({ message: 'Email Existente' })
      const hassPass = await bcrypt.hash(pass, 10)
      const newUser = new User({
        nombre,
        password: hassPass,
        email
      })
      const user = await newUser.save()
      if (!user) return res.json({ message: 'Error al guardar el usuario' })
      res.json({ message: 'Usuario registrado con exito', status: true })
    } catch (error) {
      console.error(error)
      res.status(404)
    }
  }

  static changePassword (req, res) {
    // to do
  }

  static recoverPassword (req, res) {
    // to do
  }

  static deleteAcount (req, res) {
    // to do
  }

  static async verifyToken (req, res) {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' })

    jwt.verify(token, JWT_KEY, async (err, user) => {
      if (err) {
        if (err.name === 'TokenExpiredError') {
          const decoded = jwt.decode(token) // decodificás sin verificar
          if (decoded?.id) {
            await User.findByIdAndUpdate(decoded.id, { activo: false })
          }
        }
        return res.status(403).json({ message: 'Token inválido o expirado' })
      }

      const usuario = await User.findById(user.id)
      if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' })

      const userFound = {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }

      return res.json({ message: 'Sesion Iniciada con exito', user: userFound, status: true })
    })
  }
}
