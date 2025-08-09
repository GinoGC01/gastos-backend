import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  rol: {
    type: String,
    default: 'user'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date
  }
})

export default mongoose.model('Users', userSchema)
