import express from 'express'
import authRoutes from './src/Routes/auth.routes.js'
import gastosRoutes from './src/Routes/gastos.routes.js'
import listasRoutes from './src/Routes/listas.routes.js'
import { CORS } from './src/Middlewares/cors.js'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'

const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(CORS())
app.use(morgan('dev'))
app.use('/api', authRoutes)
app.use('/api', gastosRoutes)
app.use('/api', listasRoutes)

export default app
