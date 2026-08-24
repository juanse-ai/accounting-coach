// Formato colombiano: punto como separador de miles, sin decimales.
const fmt = new Intl.NumberFormat('es-CO', { maximumFractionDigits: 0 })

export const formatearMonto = (n) => (Number.isFinite(n) ? fmt.format(n) : '0')

export const formatearPesos = (n) => `$ ${formatearMonto(n)}`

// El input se maneja como texto: se dejan solo dígitos y se reagrupan los miles
// en cada tecla, para que el usuario vea 1.200.000 mientras escribe.
export const soloDigitos = (texto) => String(texto).replace(/\D+/g, '')

export function formatearEntrada(texto) {
  const digitos = soloDigitos(texto).replace(/^0+(?=\d)/, '')
  if (!digitos) return ''
  return formatearMonto(Number(digitos))
}

export const montoDesdeEntrada = (texto) => {
  const digitos = soloDigitos(texto)
  return digitos ? Number(digitos) : 0
}
