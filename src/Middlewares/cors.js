import cors from 'cors'
import { ACEPTED_ORIGIN_FRONT } from '../config.js'

const ACCEPTED_ORIGINS = [
  ACEPTED_ORIGIN_FRONT
]

export const CORS = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) =>
  cors({
    origin: (origin, callback) => {
      if (acceptedOrigins.includes(origin)) {
        return callback(null, true)
      }

      if (!origin) {
        return callback(null, true)
      }

      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true
  })
