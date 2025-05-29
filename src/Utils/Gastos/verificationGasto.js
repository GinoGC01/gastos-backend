export const verificationGasto = ({ titulo, descripcion, monto, seDivide }) => {
  if (!titulo || !descripcion || !monto || !seDivide) { return { status: false, error: 'faltan datos' } }

  if (typeof titulo !== 'string' || titulo.trim() === '') {
    return { error: 'El campo "titulo" es requerido y debe ser un string.', status: false }
  }

  if (typeof descripcion !== 'string' || descripcion.trim() === '') {
    return { error: 'El campo "descripcion" es requerido y debe ser un string.', status: false }
  }

  if (typeof monto !== 'number' || isNaN(monto)) {
    return { error: 'El campo "monto" es requerido y debe ser un número.', status: false }
  }

  if (!Array.isArray(seDivide)) {
    return { error: 'El campo "seDivideEn" debe ser un array.', status: false }
  }

  return { success: 'El campo "seDivideEn" debe ser un array.', status: false }
}
