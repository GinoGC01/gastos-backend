import Gasto from '../Models/Gasto.js'
import { verificationGasto } from '../Utils/Gastos/verificationGasto.js'

export class GastosController {
  static async getAllGastos (req, res) {
    const user = req.user
    console.log(user)
    if (!user) return res.json({ message: 'Inicie sesion para continuar.' })

    const response = await Gasto.find({ creadoPor: user.id })
    if (!response) return res.json({ status: false, message: 'Error al encontrar los gastos' })

    res.json({ message: 'Gastos encontrados con exito', gastos: response })
  }

  static async createGasto (req, res) {
    // to do
    try {
      const { titulo, descripcion, monto, seDivide, creadoPor } = req.body
      const responseVerification = verificationGasto(titulo, descripcion, monto, seDivide)

      if (!responseVerification) return { message: responseVerification.error }

      const newGasto = new Gasto({
        titulo,
        descripcion,
        monto,
        creadoPor,
        seDivide
      })

      const response = await newGasto.save()
      if (!response) return res.status(400).json({ error: 'No se pudo arreglar' })
      res.json({
        gasto: {
          titulo,
          descripcion,
          monto,
          creadoPor,
          seDivide
        },
        message: 'Gasto agregado con exito'
      })
    } catch (error) {
      console.error(error)
      if (error.errorResponse.code === 11000) return res.status(200).json({ mensaje: 'Por favor, revise los datos ingresados. No se permiten gastos duplicados' })
      res.status(400).json({ message: 'ERROR: Error al agregar gasto' })
    }
  }

  static async updateGasto (req, res) {
    try {
      const { id } = req.params
      const usuarioId = req.user.id // desde auth middleware
      const datosActualizados = req.body

      const gasto = await Gasto.findById(id)

      if (!gasto) {
        return res.status(404).json({ mensaje: 'Gasto no encontrado' })
      }

      // el usuario sea el creador del gasto
      if (gasto.creadoPor.toString() !== usuarioId) {
        console.log(gasto.creadoPor, usuarioId)
        return res.status(403).json({ mensaje: 'No autorizado para modificar este gasto' })
      }

      // Actualiza los campos permitidos
      gasto.titulo = datosActualizados.titulo ?? gasto.titulo
      gasto.monto = datosActualizados.monto ?? gasto.monto
      gasto.categoria = datosActualizados.categoria ?? gasto.categoria
      gasto.fecha = datosActualizados.fecha ?? gasto.fecha
      gasto.seDivide = datosActualizados.seDivide ?? gasto.seDivide

      await gasto.save()

      res.json({
        mensaje: 'Gasto actualizado correctamente',
        gasto
      })
    } catch (error) {
      console.error(error)

      return res.status(500).json({ mensaje: 'Error al actualizar el gasto' })
    }
  }

  static async deleteGasto (req, res) {
    // to do
    try {
      const { id } = req.params
      const response = await Gasto.findByIdAndDelete(id)
      if (!response) return res.json({ status: false, message: 'No se encontro el gasto' })
      console.log(response)
      return res.json({ status: true, message: 'Gasto eliminado correctamente', titulo: response.titulo })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ mensaje: 'Error al eliminar el gasto' })
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
      return res.status(500).json({ mensaje: 'Error al traer los gastos' })
    }
  }
}
