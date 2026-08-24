import { buscarCuenta } from '../data/planCuentas.js'

export const DEBITO = 'Débito'
export const CREDITO = 'Crédito'

export const lineaVacia = (linea) =>
  !linea.cuenta && !linea.padre && !linea.lado && !linea.monto

export const lineaCompleta = (linea) =>
  Boolean(linea.cuenta && linea.padre && linea.lado && linea.monto > 0)

export function totales(lineas) {
  let debitos = 0
  let creditos = 0
  for (const l of lineas) {
    if (!(l.monto > 0) || !l.lado) continue
    if (l.lado === DEBITO) debitos += l.monto
    else if (l.lado === CREDITO) creditos += l.monto
  }
  return { debitos, creditos, diferencia: debitos - creditos, cuadra: debitos === creditos && debitos > 0 }
}

const otroLado = (lado) => (lado === DEBITO ? CREDITO : DEBITO)

const plural = (n, sing, pl) => (n === 1 ? sing : pl)

// Una pista por asiento, elegida por el tipo de error dominante.
// Son reglas generales de contabilidad, no la respuesta del ejercicio.
function elegirPista({ sobran, faltan, padresMal, ladosMal, montosMal }) {
  if (sobran || faltan) {
    return 'Pregúntate qué recibió el negocio y qué entregó o en qué se comprometió a cambio.'
  }
  if (padresMal) {
    return 'Antes del monto, decide la naturaleza de cada cuenta: ¿es algo que el negocio tiene, algo que debe, lo que aportó el dueño, algo que ganó o algo que ya consumió?'
  }
  if (ladosMal) {
    return 'Activo y Gasto aumentan al Débito; Pasivo, Patrimonio e Ingreso aumentan al Crédito. Para disminuir, el lado contrario — y una cuenta contraria se mueve al revés de su padre.'
  }
  if (montosMal) {
    return 'Revisa las cifras del enunciado: puede que alguna haya que repartir en el tiempo, o separar en dos conceptos, antes de registrarla.'
  }
  return 'Pregúntate qué recibió el negocio y qué entregó o en qué se comprometió a cambio.'
}

/**
 * Compara el asiento del usuario contra el esperado sin importar el orden.
 * Nunca devuelve la respuesta completa: solo señala qué está mal en cada línea
 * y, si falta una línea, dice el lado pero no la cuenta.
 */
export function verificarAsiento(lineasUsuario, esperadas) {
  const usadas = lineasUsuario.filter((l) => !lineaVacia(l))

  if (usadas.length === 0) {
    return { estado: 'incompleto', mensaje: 'Arma el asiento antes de verificar.' }
  }

  const incompletas = usadas.filter((l) => !lineaCompleta(l))
  if (incompletas.length > 0) {
    return {
      estado: 'incompleto',
      mensaje: `${plural(incompletas.length, 'Hay una línea', `Hay ${incompletas.length} líneas`)} sin completar: cada línea necesita cuenta, cuenta padre, lado y monto.`,
    }
  }

  const pendientes = esperadas.map((e, i) => ({ ...e, i, tomada: false }))
  const errores = []
  const vistas = new Set()
  let correctas = 0
  const conteo = { sobran: 0, faltan: 0, padresMal: 0, ladosMal: 0, montosMal: 0 }

  for (const linea of usadas) {
    if (vistas.has(linea.cuenta)) {
      errores.push({
        tipo: 'repetida',
        cuenta: linea.cuenta,
        texto: `«${linea.cuenta}» está repetida. En este asiento cada cuenta aparece una sola vez.`,
      })
      conteo.sobran += 1
      continue
    }
    vistas.add(linea.cuenta)

    const esperada = pendientes.find((p) => !p.tomada && p.cuenta === linea.cuenta)

    if (!esperada) {
      errores.push({
        tipo: 'sobra',
        cuenta: linea.cuenta,
        texto: `«${linea.cuenta}» no pertenece a este asiento.`,
      })
      conteo.sobran += 1
      continue
    }

    esperada.tomada = true
    const detalles = []

    if (linea.padre !== esperada.padre) {
      const info = buscarCuenta(linea.cuenta)
      const razon = info?.razon ? `: ${info.razon}` : ''
      detalles.push(
        `su cuenta padre no es ${linea.padre} sino ${esperada.padre}${razon}.`
      )
      conteo.padresMal += 1
    }

    if (linea.lado !== esperada.lado) {
      detalles.push(
        `en este asiento va al ${esperada.lado}, no al ${otroLado(esperada.lado)}.`
      )
      conteo.ladosMal += 1
    }

    if (linea.monto !== esperada.monto) {
      detalles.push(`el monto correcto es ${new Intl.NumberFormat('es-CO').format(esperada.monto)}.`)
      conteo.montosMal += 1
    }

    if (detalles.length === 0) {
      correctas += 1
    } else {
      errores.push({
        tipo: 'linea',
        cuenta: linea.cuenta,
        texto: `«${linea.cuenta}»: ${detalles.join(' Además, ')}`,
      })
    }
  }

  // Líneas que faltan: se dice el lado, nunca la cuenta.
  const faltantes = pendientes.filter((p) => !p.tomada)
  conteo.faltan = faltantes.length
  const faltanDebito = faltantes.filter((f) => f.lado === DEBITO).length
  const faltanCredito = faltantes.filter((f) => f.lado === CREDITO).length

  if (faltanDebito > 0) {
    errores.push({
      tipo: 'falta',
      texto:
        faltanDebito === 1
          ? 'Falta una línea al Débito: hay una cuenta del asiento que todavía no registraste.'
          : `Faltan ${faltanDebito} líneas al Débito: hay cuentas del asiento que todavía no registraste.`,
    })
  }
  if (faltanCredito > 0) {
    errores.push({
      tipo: 'falta',
      texto:
        faltanCredito === 1
          ? 'Falta una línea al Crédito: hay una cuenta del asiento que todavía no registraste.'
          : `Faltan ${faltanCredito} líneas al Crédito: hay cuentas del asiento que todavía no registraste.`,
    })
  }

  if (errores.length === 0) {
    return { estado: 'correcto', errores: [], correctas }
  }

  return {
    estado: 'incorrecto',
    errores,
    correctas,
    pista: elegirPista(conteo),
  }
}
