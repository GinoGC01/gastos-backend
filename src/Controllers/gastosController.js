import Gasto from '../Models/Gasto.js'
import mongoose from 'mongoose'
import { verificationGasto } from '../Utils/Gastos/verificationGasto.js'

export class GastosController {
  static async getAllGastos (req, res) {
    const user = req.user
    if (!user) return res.json({ message: 'Inicie sesion para continuar.' })

    try {
      const response = await Gasto.find({ 'seDivide.userId': user.id }).populate([
        { path: 'seDivide.userId', select: 'nombre email' },
        { path: 'historialActualizaciones.cambios.seDivide.userId', select: 'nombre email' }
      ])
      if (!response) return res.json({ status: false, message: 'Error al encontrar los gastos' })
      if (response.length === 0) return res.json({ status: true, message: 'No posee gastos en este momento', gastos: [] })
      res.json({ message: 'Gastos encontrados con exito', gastos: response, status: true })
    } catch (error) {
      console.error(error)
      res.status(401).json({ message: 'Gastos no encontrados', status: false, error })
    }
  }

  static async createGasto (req, res) {
    try {
      const { titulo, descripcion, monto, seDivide, creadoPor, categoria } = req.body
      const responseVerification = verificationGasto(titulo, descripcion, monto, seDivide)

      if (!responseVerification) return res.status(400).json({ message: responseVerification.error })

      const newGasto = new Gasto({
        titulo,
        descripcion,
        monto,
        creadoPor,
        seDivide: seDivide.map(id => ({ userId: id })),
        categoria
      })

      const response = await newGasto.save()

      if (!response) return res.status(400).json({ error: 'No se pudo arreglar' })
      // agregar validacion de categoria

      return res.status(200).json({
        gasto: {
          titulo,
          descripcion,
          monto,
          creadoPor,
          seDivide,
          categoria
        },
        message: 'Gasto agregado con exito',
        status: true
      })
    } catch (error) {
      console.error(error)
      if (error.errorResponse.code === 11000) return res.status(200).json({ message: 'Por favor, revise los datos ingresados. No se permiten gastos duplicados' })
      res.status(400).json({ message: 'ERROR: Error al agregar gasto' })
    }
  }

  static async updateGasto (req, res) {
    try {
      const { id } = req.params
      const usuarioId = req.user.id
      const datosActualizados = { ...req.body }

      const gasto = await Gasto.findById(id)
      if (!gasto) {
        return res.status(404).json({ message: 'Gasto no encontrado' })
      }

      if (gasto.creadoPor.toString() !== usuarioId) {
        return res.status(403).json({ message: 'No autorizado para modificar este gasto' })
      }

      const cambios = {}

      for (const campo in datosActualizados) {
        if (campo === 'seDivide') {
          const original = Array.isArray(gasto.seDivide) ? gasto.seDivide : []
          const actualizado = Array.isArray(datosActualizados.seDivide) ? datosActualizados.seDivide : []

          const originalLen = original.length
          const actualizadoLen = actualizado.length

          const sonIguales =
          originalLen === actualizadoLen &&
          JSON.stringify(original) === JSON.stringify(actualizado)

          const cambioSignificativo =
          (originalLen === 1 && actualizadoLen > 1) ||
          (originalLen > 1 && actualizadoLen === 1) ||
          (originalLen > 1 && actualizadoLen > 1 && !sonIguales)

          if (cambioSignificativo) {
            cambios[campo] = actualizado
          }

          continue // ya evaluamos seDivide
        }

        if (
          datosActualizados[campo] !== undefined &&
        JSON.stringify(datosActualizados[campo]) !== JSON.stringify(gasto[campo])
        ) {
          cambios[campo] = datosActualizados[campo]
        }
      }

      if (Object.keys(cambios).length > 0) {
        gasto.historialActualizaciones.push({
          userId: usuarioId,
          fecha: new Date(),
          cambios
        })
      }

      // Actualizaciones finales
      gasto.titulo = datosActualizados.titulo ?? gasto.titulo
      gasto.monto = datosActualizados.monto ?? gasto.monto
      gasto.descripcion = datosActualizados.descripcion ?? gasto.descripcion
      gasto.categoria = datosActualizados.categoria ?? gasto.categoria
      gasto.fecha = datosActualizados.fecha ?? gasto.fecha

      if (Array.isArray(datosActualizados.seDivide)) {
        gasto.seDivide = datosActualizados.seDivide
      }

      await gasto.save()

      return res.json({
        status: true,
        message: 'Gasto actualizado correctamente'
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error al actualizar el gasto', status: false })
    }
  }

  static async updateStateGasto (req, res) {
    try {
      const { id } = req.params
      const usuarioId = req.user.id // desde auth middleware

      const gasto = await Gasto.findById(id)

      if (!gasto) {
        return res.status(404).json({ message: 'Gasto no encontrado' })
      }

      // el usuario sea el creador del gasto
      if (gasto.creadoPor.toString() !== usuarioId) {
        return res.status(403).json({ message: 'No autorizado para modificar el estado de este gasto', status: true })
      }

      gasto.estado = 'pagado'

      await gasto.save()

      res.json({
        status: true,
        message: 'Gasto pagado'
      })
    } catch (err) {
      console.error(err)
      return res.status(500).json({ message: 'Error al actualizar el gasto', status: false })
    }
  }

  static async deleteGasto (req, res) {
    try {
      const user = req.user
      if (!user) return res.status(401).json({ message: 'Inicie sesión para continuar.' })

      const { id } = req.params

      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ status: false, message: 'ID de gasto inválido' })
      }

      const gasto = await Gasto.findById(id)
      if (!gasto) {
        return res.status(404).json({ status: false, message: 'Gasto no encontrado' })
      }

      // Verificación de autoría con equals()
      if (!gasto.creadoPor.equals(user.id)) {
        return res.status(403).json({
          status: true,
          message: 'No tiene permiso para eliminar este gasto. Solo el creador puede hacerlo.'
        })
      }

      await Gasto.findByIdAndDelete(id)

      return res.json({
        status: true,
        message: 'Gasto eliminado correctamente'
      })
    } catch (error) {
      console.error('[DELETE GASTO]', error)
      return res.status(500).json({ status: false, message: 'Error interno al eliminar el gasto' })
    }
  }

  static async getResumen (req, res) {
    // to do
    try {
      const response = await Gasto.find().populate('creadoPor', 'nombre email').populate('seDivide.userId', 'nombre email')
      if (!response) return res.status(400).json({ message: 'Error al obtener los gastos' })
      if (response.length === 0) return res.json({ message: 'No se registran gastos', response })
      const newGastos = response?.map(({
        titulo,
        monto,
        descripcion,
        creadoPor,
        seDivide,
        fechaCreacion
      }) => {
        return {
          titulo,
          monto,
          descripcion,
          creadoPor,
          seDivide,
          fechaCreacion
        }
      })
      return res.json({ message: 'gastos', gastos: newGastos })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ message: 'Error al traer los gastos' })
    }
  }
}
