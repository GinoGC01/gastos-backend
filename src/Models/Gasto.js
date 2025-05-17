import mongoose from 'mongoose'

const userDivide = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  }
})

const gastoSchema = new mongoose.Schema({
  nombre: {
    type: String,
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
  seDivideEn: [userDivide],
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Gastos', gastoSchema)
