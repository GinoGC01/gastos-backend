import User from '../Models/User.js'
import { verificationIfExistUser, verificationLoginUser } from '../Utils/Auth/verificationIfUser.js'
import { verificationUserData } from '../Utils/Auth/verificationUser.js'
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config.js'

import bcrypt from 'bcryptjs'

export class AuthController {
  static async login (req, res) {
    // to do
    const { email, pass } = req.body

    try {
      const acceptedUser = await verificationLoginUser({ email, pass })

      if (!acceptedUser.status) return res.json({ message: acceptedUser.message, status: acceptedUser.status })

      if (acceptedUser.status) {
        const token = jwt.sign({
          id: acceptedUser.user.id,
          nombre: acceptedUser.user.nombre,
          email: acceptedUser.user.email
        },
        JWT_KEY, {
          expiresIn: '1h'
        })

        // Guardar el token en una cookie HTTP Only
        res.cookie('token', token, {
          // httpOnly: true, // evita acceso desde JS del cliente
          // secure: process.env.NODE_ENV === 'production', // sólo en HTTPS en producción
          sameSite: 'strict', // previene CSRF
          maxAge: 3600000 // 1 hora
        }).json({ message: 'Sesion Iniciada con exito', user: acceptedUser.user, status: true })
      }
    } catch (error) {
      console.error(error)
      res.status(404).json({ message: 'Error al iniciar sesion' })
    }
  }

  static async logout (req, res) {
    try {
      res.clearCookie('token').json({ message: 'sesion cerrada', status: true })
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

    if (!token) return res.status(401).json({ message: 'Acceso no autorizado ' })

    jwt.verify(token, JWT_KEY, async (err, user) => {
      if (err) return res.status(401).json({ message: 'Acceso no autorizado' })

      const usuario = await User.findById(user.id)
      if (!usuario) return res.status(401).json({ message: 'Usuario no encontrado' })

      return res.json({
        status: true,
        user: {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        }
      })
    })
  }
}
