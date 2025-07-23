import mongoose from 'mongoose'

// Subdocumento para historial de cambios
const historialSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  cambios: {
    type: Map,
    of: mongoose.Schema.Types.Mixed // `mongoose.Schema.Types.Mixed` guardar cualquier tipo
  }
}, { _id: false })

// Subdocumento para división de gastos
const seDivideSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
}, { _id: false })

// Esquema principal del gasto
const gastoSchema = new mongoose.Schema({
  titulo: {
    type: String,
    unique: true,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  monto: {
    type: Number,
    required: true
  },
  creadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  },
  seDivide: [seDivideSchema],
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  estado: {
    type: String,
    default: 'pendiente'
  },
  categoria: {
    type: String
  },
  historialActualizaciones: [historialSchema]
})

export default mongoose.model('Gastos', gastoSchema)
