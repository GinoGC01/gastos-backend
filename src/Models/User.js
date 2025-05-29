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
    required: true
  },
  rol: {
    type: String,
    default: 'user'
  },
  fechaRegistro: {
    type: Date,
    default: Date.now
  }
})

export default mongoose.model('Users', userSchema)
