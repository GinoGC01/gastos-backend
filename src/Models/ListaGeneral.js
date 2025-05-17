import mongoose from 'mongoose'

const gasto = new mongoose.Schema({
  gastoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Gasto',
    required: true
  }
})

const gastoSchema = new mongoose.Schema({
  gastos: [gasto],
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  periodos: [{
    mes: { type: String, required: true },
    desde: { type: String },
    hasta: { type: String }
  }]
})

export default mongoose.model('Gastos', gastoSchema)
