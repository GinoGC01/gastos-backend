export const verificationUserData = ({ nombre, pass, email }) => {
  console.log(nombre, pass, email)
  const nombreRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/
  const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!nombre || !pass || !email) return { message: 'faltan datos', status: false }

  if (!nombreRegex.test(nombre)) return { message: 'El nombre debe comenzar con mayúscula y solo contener letras.', status: false }
  if (!regexEmail.test(email)) return { message: 'Email inválido.', status: false }
  if (!passRegex.test(pass)) return { message: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un símbolo.', status: false }

  return {
    nombre, pass, email, status: true
  }
}
