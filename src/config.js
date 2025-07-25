import { config } from 'dotenv'
config()

export const JWT_KEY = process.env.JWT_KEY
export const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/gastos'
export const PORT = process.env.PORT || 3000
