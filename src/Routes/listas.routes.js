import express from 'express'
import { ListaController } from '../Controllers/listasController'

const listasRoutes = express.Router()

listasRoutes.post('/crearLista', ListaController.createLista)
listasRoutes.delete('/deleteLista', ListaController.deleteLista)
listasRoutes.get('/AllListas', ListaController.AllListas)
listasRoutes.put('/updateListas', ListaController.updateLista)

export default listasRoutes
