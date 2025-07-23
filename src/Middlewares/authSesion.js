import jwt from 'jsonwebtoken'
import { JWT_KEY } from '../config.js'

export const authSession = (req, res, next) => {
  const token = req.cookies.token

  if (!token) return res.status(401).json({ message: 'Inicie Sesion para continuar' })

  try {
    req.user = jwt.verify(token, JWT_KEY)
    next()
  } catch (err) {
    console.error('Token inválido o expirado:', err.message)
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}
