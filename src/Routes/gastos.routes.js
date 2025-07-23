import express from 'express'
import { GastosController } from '../Controllers/gastosController.js'
import { authSession } from '../Middlewares/authSesion.js'

const gastosRoutes = express.Router()

gastosRoutes.get('/gastos', authSession, GastosController.getAllGastos) // get all gastos
gastosRoutes.post('/gastos', authSession, GastosController.createGasto)
gastosRoutes.put('/gastos/:id', authSession, GastosController.updateGasto) // actualizar gasto
gastosRoutes.put('/gasto/:id', authSession, GastosController.updateStateGasto)

gastosRoutes.delete('/gastos/:id', authSession, GastosController.deleteGasto)

gastosRoutes.get('/gastos/resumen', authSession, GastosController.getResumen)

export default gastosRoutes
