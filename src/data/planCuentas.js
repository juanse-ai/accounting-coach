// Plan de cuentas. `padre` NO se usa para autocompletar el formulario:
// solo lo consume la verificación. Clasificar es lo que se está practicando.

export const CUENTAS_PADRE = ['Activo', 'Pasivo', 'Patrimonio', 'Ingreso', 'Gasto']

export const PLAN_CUENTAS = [
  { nombre: 'Caja', padre: 'Activo', razon: 'es dinero que el negocio ya controla' },
  { nombre: 'Bancos', padre: 'Activo', razon: 'es dinero del negocio depositado en una entidad financiera' },
  { nombre: 'Cuentas por Cobrar', padre: 'Activo', razon: 'es un derecho de cobro a favor del negocio' },
  { nombre: 'Inventario', padre: 'Activo', razon: 'es mercancía que el negocio posee para vender' },
  { nombre: 'Seguros Pagados por Anticipado', padre: 'Activo', razon: 'es un derecho a cobertura futura ya pagada' },
  { nombre: 'Equipo', padre: 'Activo', razon: 'es un bien que el negocio usa durante varios períodos' },
  { nombre: 'Vehículos', padre: 'Activo', razon: 'es un bien que el negocio usa durante varios períodos' },
  { nombre: 'Depreciación Acumulada', padre: 'Activo', contraria: true, razon: 'vive dentro del Activo aunque lo reste: acumula el desgaste del bien' },
  { nombre: 'Cuentas por Pagar', padre: 'Pasivo', razon: 'es una deuda con un proveedor' },
  { nombre: 'Obligaciones Financieras', padre: 'Pasivo', razon: 'es una deuda con una entidad financiera' },
  { nombre: 'Ingresos Diferidos', padre: 'Pasivo', razon: 'es dinero ya cobrado por algo que todavía debes entregar' },
  { nombre: 'IVA por Pagar', padre: 'Pasivo', razon: 'es dinero recaudado que le pertenece al Estado' },
  { nombre: 'Salarios por Pagar', padre: 'Pasivo', razon: 'es una deuda con los empleados por trabajo ya recibido' },
  { nombre: 'Capital Social', padre: 'Patrimonio', razon: 'es lo que el dueño aportó al negocio' },
  { nombre: 'Retiros del Propietario', padre: 'Patrimonio', contraria: true, razon: 'vive dentro del Patrimonio aunque lo reste: registra lo que el dueño sacó' },
  { nombre: 'Ingresos por Ventas', padre: 'Ingreso', razon: 'registra lo que el negocio ganó al entregar producto o servicio' },
  { nombre: 'Costo de Ventas', padre: 'Gasto', razon: 'es el costo del producto ya entregado, consumido en el período' },
  { nombre: 'Gasto de Arriendo', padre: 'Gasto', razon: 'es un beneficio ya consumido en el período' },
  { nombre: 'Gasto de Salarios', padre: 'Gasto', razon: 'es trabajo ya recibido y consumido en el período' },
  { nombre: 'Gasto de Seguros', padre: 'Gasto', razon: 'es la porción de cobertura que ya se consumió' },
  { nombre: 'Gasto de Servicios Públicos', padre: 'Gasto', razon: 'es un consumo del período' },
  { nombre: 'Gasto de Depreciación', padre: 'Gasto', razon: 'es el desgaste del período llevado al resultado' },
]

// Lista plana y alfabética a propósito: agruparla por cuenta padre
// regalaría la clasificación que el ejercicio pide deducir.
export const CUENTAS_ORDENADAS = [...PLAN_CUENTAS].sort((a, b) =>
  a.nombre.localeCompare(b.nombre, 'es')
)

const porNombre = new Map(PLAN_CUENTAS.map((c) => [c.nombre, c]))
export const buscarCuenta = (nombre) => porNombre.get(nombre) ?? null
