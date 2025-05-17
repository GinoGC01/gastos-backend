import express from 'express'
import authRoutes from './src/Routes/auth.routes.js'
import gastosRoutes from './src/Routes/gastos.routes.js'
import listasRoutes from './src/Routes/listas.routes.js'

const app = express()
app.use('/api', authRoutes)
app.use('/api', gastosRoutes)
app.use('/api', listasRoutes)

export default app
