import User from '../Models/User.js'
import { verificationIfExistUser, verificationLoginUser } from '../Utils/Auth/verificationIfUser.js'
import { verificationUserData } from '../Utils/Auth/verificationUser.js'
import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config.js'
import bcrypt from 'bcryptjs'

export class AuthController {
  static async getUsers(req, res) {
    // to do getUsers tiene que devolver los usuarios que estan dentro de una lista
    try {
      const users = await User.find()
      if (!users) {
        return res
          .status(404)
          .json({ message: 'Error al encontrar usuarios', users, status: false })
      }
      const newUsers = users.map((user) => {
        return {
          _id: user._id,
          nombre: user.nombre,
          email: user.email
        }
      })
      res.json({ users: newUsers, status: true })
    } catch (error) {
      console.error(error)
      res.status(404).json({ message: 'Error al encontrar usuarios' })
    }
  }

  static async login(req, res) {
    const { email, pass } = req.body

    try {
      // Verificar credenciales
      const acceptedUser = await verificationLoginUser({ email, pass })

      if (!acceptedUser.status) {
        return res.json({
          message: acceptedUser.message,
          status: false
        })
      }

      const usuario = await User.findById(acceptedUser.user.id)
      if (!usuario) {
        return res.status(404).json({ message: 'Usuario no encontrado', status: false })
      }

      // ✅ Opcional: Bloquear login si ya tiene una sesión activa sin expirar
      if (usuario.activo && usuario.expiresAt > Date.now()) {
        return res.json({
          message: 'Ya tienes una sesión activa',
          status: false
        })
      }

      // Crear token JWT con expiración de 1 hora
      const token = jwt.sign(
        {
          id: usuario.id,
          nombre: usuario.nombre,
          email: usuario.email
        },
        JWT_KEY,
        { expiresIn: '1h' }
      )

      // Marcar usuario como activo y setear fecha de expiración
      usuario.activo = true
      usuario.expiresAt = new Date(Date.now() + 60 * 60 * 1000) // ahora + 1 hora

      await usuario.save()

      console.log(
        '[LOGIN] Usuario logueado:',
        usuario.email,
        'expira en:',
        new Date(usuario.expiresAt).toISOString()
      )

      // Guardar el token en cookie segura
      res
        .cookie('token', token, {
          // httpOnly: true, // Previene acceso desde JS del cliente
          // secure: process.env.NODE_ENV === 'production', // Solo HTTPS en producción
          sameSite: 'strict', // Previene ataques CSRF
          maxAge: 60 * 60 * 1000 // 1 hora
        })
        .json({
          message: 'Sesión iniciada con éxito',
          user: {
            id: usuario.id,
            nombre: usuario.nombre,
            email: usuario.email
          },
          status: true
        })
    } catch (error) {
      console.error('[LOGIN] Error al iniciar sesión:', error.message)
      res.status(500).json({ message: 'Error interno al iniciar sesión', status: false })
    }
  }

  static async logout(req, res) {
    const { token } = req.cookies
    try {
      jwt.verify(token, JWT_KEY, async (err, user) => {
        if (err) {
          return res
            .status(401)
            .json({ message: 'No hay token para verificar usuario', status: false })
        }

        const usuario = await User.findById(user.id)
        if (!usuario) {
          return res
            .status(401)
            .json({ message: 'Usuario no encontrado al cerrar sesion', status: false })
        }

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

  static async register(req, res) {
    // to do
    const { nombre, pass, email } = req.body

    const dataVerificada = verificationUserData({ nombre, pass, email })
    if (!dataVerificada.status) {
      return res.json({ message: 'Error data verificada', error: dataVerificada.message })
    }

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

  static changePassword(req, res) {
    // to do
  }

  static recoverPassword(req, res) {
    // to do
  }

  static deleteAcount(req, res) {
    // to do
  }

  static async verifyToken(req, res) {
    const { token } = req.cookies

    if (!token) return res.status(401).json({ message: 'Acceso no autorizado' })

    jwt.verify(token, JWT_KEY, async (err, user) => {
      if (err) {
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
