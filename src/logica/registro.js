// Validación del formulario del landing. Es un espejo de los CHECK de la
// tabla `participantes` y de las validaciones de `registrar_participante`:
// aquí para dar el error de inmediato, allá porque el cliente no es de fiar.

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/

export const normalizarNombre = (valor) => valor.trim().replace(/\s+/g, ' ')
export const normalizarEmail = (valor) => valor.trim().toLowerCase()

export function validarRegistro({ nombre, email }) {
  const errores = {}

  const n = normalizarNombre(nombre ?? '')
  if (!n) errores.nombre = 'Escribe tu nombre.'
  else if (n.length > 120) errores.nombre = 'El nombre es demasiado largo.'

  const e = normalizarEmail(email ?? '')
  if (!e) errores.email = 'Escribe tu correo.'
  else if (!EMAIL.test(e) || e.length > 254) errores.email = 'Ese correo no parece válido.'

  return { valido: Object.keys(errores).length === 0, errores, nombre: n, email: e }
}
