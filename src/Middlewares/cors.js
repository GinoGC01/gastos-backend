import cors from 'cors'
import { ACEPTED_ORIGIN_FRONT } from '../config.js'

const ACCEPTED_ORIGINS = [
  ACEPTED_ORIGIN_FRONT
]

export const CORS = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true) // permitir desde Postman u otros

      const cleanOrigin = origin.replace(/\/$/, '') // quita barra final
      const match = acceptedOrigins.some(o => o === cleanOrigin)

      if (match) return callback(null, true)

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })

  
export default CORS