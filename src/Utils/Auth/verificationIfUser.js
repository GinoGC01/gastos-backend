import User from '../../Models/User.js'
import bcrypt from 'bcryptjs'

export const verificationIfExistUser = async ({ email }) => {
  const emailExist = await User.find({ email })
  if (emailExist.length === 1 && emailExist[0] === email) return { message: 'Email existente' }
  return false
}

export const verificationLoginUser = async ({ email, pass }) => {
  if (!email) return { message: 'Ingrese el Email para continuar', status: false }
  if (!pass) return { message: 'Ingrese el password para continuar', status: false }

  const userFinded = await User.find({ email })
  if (userFinded.length === 0) return { message: 'Usuario no Registrado', status: false }
  const hassPass = await bcrypt.compare(pass, userFinded[0].password)
  if (!hassPass) return { message: 'Contraseña incorrecta, intente nuevamente', status: false }
  if (userFinded[0].activo) return { message: 'Usuario ya activo', status: false }
  return {
    message: 'Usuario registrado',
    status: true,
    user: {
      id: userFinded[0]._id,
      nombre: userFinded[0].nombre,
      email: userFinded[0].email
    }
  }
}
