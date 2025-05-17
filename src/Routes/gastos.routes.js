import express from 'express'
import { GastosController } from '../Controllers/gastosController.js'

const gastosRoutes = express.Router()

gastosRoutes.get('/gastos', GastosController.getAllGastos) // get all gastos
gastosRoutes.post('/gastos', GastosController.createGasto)
gastosRoutes.put('/gastos/:id', GastosController.updateGasto) // actualizar gasto
gastosRoutes.delete('/gastos', GastosController.deleteGasto)

export default gastosRoutes
