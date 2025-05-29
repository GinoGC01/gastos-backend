import mongoose from 'mongoose'

const user = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true
  }
})

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
  seDivide: [user],
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Gastos', gastoSchema)
