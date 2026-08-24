// Los 18 ejercicios del set. Contenido verificado: no agregar, no alterar montos,
// no reescribir notas. El set se queda en 18 a propósito.

const D = 'Débito'
const C = 'Crédito'

export const EJERCICIOS = [
  {
    id: '01',
    nivel: 'Básico',
    hecho: 'Doña Ruca abre su panadería y aporta 5.000.000 de su bolsillo, que deposita en la caja del negocio.',
    lineas: [
      { cuenta: 'Caja', padre: 'Activo', lado: D, monto: 5000000 },
      { cuenta: 'Capital Social', padre: 'Patrimonio', lado: C, monto: 5000000 },
    ],
    nota: 'El dinero entra al negocio (activo sube, débito) y el propietario adquiere un derecho sobre él (patrimonio sube, crédito). El negocio y la persona son entidades distintas: por eso el aporte crea una obligación conceptual del negocio hacia su dueño.',
  },
  {
    id: '02',
    nivel: 'Básico',
    hecho: 'Compra un horno industrial por 2.000.000, pagando de contado.',
    lineas: [
      { cuenta: 'Equipo', padre: 'Activo', lado: D, monto: 2000000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 2000000 },
    ],
    nota: 'Cambias un activo por otro. El patrimonio no se mueve: la panadería no es más rica ni más pobre, solo tiene el valor en otra forma. Comprar equipo nunca es un gasto en el momento de la compra.',
  },
  {
    id: '03',
    nivel: 'Básico',
    hecho: 'Compra harina e insumos por 800.000 a un proveedor, que le da 30 días para pagar.',
    lineas: [
      { cuenta: 'Inventario', padre: 'Activo', lado: D, monto: 800000 },
      { cuenta: 'Cuentas por Pagar', padre: 'Pasivo', lado: C, monto: 800000 },
    ],
    nota: 'No se movió un peso de caja y aun así hay un hecho económico que registrar. Entra mercancía (activo) y nace una deuda (pasivo). Este es el caso que un sistema de solo-efectivo no puede ver.',
  },
  {
    id: '04',
    nivel: 'Básico',
    hecho: 'Vende pan de contado por 300.000.',
    lineas: [
      { cuenta: 'Caja', padre: 'Activo', lado: D, monto: 300000 },
      { cuenta: 'Ingresos por Ventas', padre: 'Ingreso', lado: C, monto: 300000 },
    ],
    nota: 'Caja es Activo, Ingresos por Ventas es Ingreso. Son cuentas padre distintas aunque se muevan juntas: una es lo que tienes, la otra es el registro de que lo ganaste.',
  },
  {
    id: '05',
    nivel: 'Básico',
    hecho: 'Le abona 500.000 en efectivo al proveedor de harina.',
    lineas: [
      { cuenta: 'Cuentas por Pagar', padre: 'Pasivo', lado: D, monto: 500000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 500000 },
    ],
    nota: 'Pagar una deuda no es un gasto: el gasto se registró cuando recibiste el beneficio; aquí solo bajan un activo y un pasivo al mismo tiempo.',
    reconstruido: true,
  },
  {
    id: '06',
    nivel: 'Básico',
    hecho: 'Paga 200.000 en efectivo por el arriendo del local del mes que acaba de terminar.',
    lineas: [
      { cuenta: 'Gasto de Arriendo', padre: 'Gasto', lado: D, monto: 200000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 200000 },
    ],
    nota: 'El mes ya pasó: el beneficio se consumió, entonces sí es gasto. Los gastos son débito porque reducen el patrimonio, y el patrimonio baja por el lado del débito.',
  },
  {
    id: '07',
    nivel: 'Intermedio',
    hecho: 'Le vende pan a un colegio por 600.000 a crédito. El colegio pagará en 30 días.',
    lineas: [
      { cuenta: 'Cuentas por Cobrar', padre: 'Activo', lado: D, monto: 600000 },
      { cuenta: 'Ingresos por Ventas', padre: 'Ingreso', lado: C, monto: 600000 },
    ],
    nota: 'El ingreso se reconoce cuando entregas el pan, no cuando te pagan. No entró efectivo y sin embargo hay ingreso: si tu sistema equipara "entró plata" con "hubo venta", aquí se rompe.',
  },
  {
    id: '08',
    nivel: 'Intermedio',
    hecho: 'Recibe un préstamo bancario de 3.000.000, desembolsado directamente a la cuenta del negocio.',
    lineas: [
      { cuenta: 'Bancos', padre: 'Activo', lado: D, monto: 3000000 },
      { cuenta: 'Obligaciones Financieras', padre: 'Pasivo', lado: C, monto: 3000000 },
    ],
    nota: 'Entró dinero pero no es ingreso: es deuda. Distinguir "plata prestada" de "plata ganada" es justamente lo que la partida simple no podía hacer.',
  },
  {
    id: '09',
    nivel: 'Intermedio',
    hecho: 'Paga 1.200.000 en efectivo por la póliza de seguro del local, que cubre los próximos 6 meses.',
    lineas: [
      { cuenta: 'Seguros Pagados por Anticipado', padre: 'Activo', lado: D, monto: 1200000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 1200000 },
    ],
    nota: 'Todavía no se consume nada: tienes el derecho a 6 meses de cobertura futura, y un derecho es un activo. Es el espejo exacto de los ingresos diferidos, pero del lado izquierdo del balance.',
  },
  {
    id: '10',
    nivel: 'Intermedio',
    hecho: 'Al cierre del mes, registra el consumo de un mes de esa póliza de seguro.',
    lineas: [
      { cuenta: 'Gasto de Seguros', padre: 'Gasto', lado: D, monto: 200000 },
      { cuenta: 'Seguros Pagados por Anticipado', padre: 'Activo', lado: C, monto: 200000 },
    ],
    nota: 'Este es un asiento de ajuste: no lo dispara una transacción, lo dispara el paso del tiempo. 1.200.000 ÷ 6 = 200.000. El activo se va convirtiendo en gasto a medida que se consume.',
  },
  {
    id: '11',
    nivel: 'Intermedio',
    hecho: 'El colegio paga los 600.000 que debía, en efectivo.',
    lineas: [
      { cuenta: 'Caja', padre: 'Activo', lado: D, monto: 600000 },
      { cuenta: 'Cuentas por Cobrar', padre: 'Activo', lado: C, monto: 600000 },
    ],
    nota: 'Aquí NO hay ingreso. El ingreso ya se registró en el ejercicio 07. Volver a registrarlo duplicaría las ventas del mes. Solo cambia la forma del activo: de derecho de cobro a efectivo.',
  },
  {
    id: '12',
    nivel: 'Intermedio',
    hecho: 'Paga 900.000 en efectivo de salarios a sus empleados por el mes trabajado.',
    lineas: [
      { cuenta: 'Gasto de Salarios', padre: 'Gasto', lado: D, monto: 900000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 900000 },
    ],
    nota: 'El trabajo ya se recibió y se consumió, entonces es gasto del período.',
  },
  {
    id: '13',
    nivel: 'Intermedio',
    hecho: 'Doña Ruca retira 150.000 en efectivo del negocio para un gasto personal.',
    lineas: [
      { cuenta: 'Retiros del Propietario', padre: 'Patrimonio', lado: D, monto: 150000 },
      { cuenta: 'Caja', padre: 'Activo', lado: C, monto: 150000 },
    ],
    nota: 'Retiros del Propietario es Patrimonio, pero es una cuenta contraria: reduce el patrimonio, por eso se mueve al débito. Se lleva aparte del Capital Social para poder ver por separado cuánto metió el dueño y cuánto sacó.',
  },
  {
    id: '14',
    nivel: 'Avanzado',
    hecho: 'Registra el costo de la mercancía vendida durante el mes: el pan que salió del inventario le costó a la panadería 480.000 producirlo.',
    lineas: [
      { cuenta: 'Costo de Ventas', padre: 'Gasto', lado: D, monto: 480000 },
      { cuenta: 'Inventario', padre: 'Activo', lado: C, monto: 480000 },
    ],
    nota: 'Este asiento va aparte del de la venta y por un monto distinto: aquí va el costo, allá iba el precio. La diferencia entre ambos es tu margen bruto. Mezclarlos corrompe el inventario y el margen a la vez.',
  },
  {
    id: '15',
    nivel: 'Avanzado',
    hecho: 'Un cliente le paga a la empresa 1.200.000 de contado por una suscripción anual que aún no se ha prestado.',
    lineas: [
      { cuenta: 'Caja', padre: 'Activo', lado: D, monto: 1200000 },
      { cuenta: 'Ingresos Diferidos', padre: 'Pasivo', lado: C, monto: 1200000 },
    ],
    nota: 'Cobraste pero no ganaste todavía: le debes al cliente 12 meses de servicio, y eso es un pasivo real. Reconocer esto como ingreso el día del cobro es el error más común en software de suscripción.',
  },
  {
    id: '16',
    nivel: 'Avanzado',
    hecho: 'Pasa un mes y la empresa reconoce la porción de esa suscripción que ya prestó.',
    lineas: [
      { cuenta: 'Ingresos Diferidos', padre: 'Pasivo', lado: D, monto: 100000 },
      { cuenta: 'Ingresos por Ventas', padre: 'Ingreso', lado: C, monto: 100000 },
    ],
    nota: '1.200.000 ÷ 12 = 100.000. El pasivo se extingue a medida que cumples la obligación, y ahí sí nace el ingreso. Ningún peso de caja se mueve en este asiento.',
  },
  {
    id: '17',
    nivel: 'Avanzado',
    hecho: 'La panadería vende 1.000.000 en producto de contado, más IVA del 19% que debe recaudar y entregar a la DIAN.',
    aviso: 'Tres líneas.',
    lineas: [
      { cuenta: 'Caja', padre: 'Activo', lado: D, monto: 1190000 },
      { cuenta: 'Ingresos por Ventas', padre: 'Ingreso', lado: C, monto: 1000000 },
      { cuenta: 'IVA por Pagar', padre: 'Pasivo', lado: C, monto: 190000 },
    ],
    nota: 'El IVA nunca fue tuyo: lo recaudas como agente de retención y lo debes, por eso es pasivo. Si registras 1.190.000 como ingreso, inflas las ventas y subestimas la deuda tributaria.',
  },
  {
    id: '18',
    nivel: 'Avanzado',
    hecho: 'Al cierre del mes registra la depreciación del horno: 100.000 correspondientes al desgaste del período.',
    lineas: [
      { cuenta: 'Gasto de Depreciación', padre: 'Gasto', lado: D, monto: 100000 },
      { cuenta: 'Depreciación Acumulada', padre: 'Activo', lado: C, monto: 100000 },
    ],
    nota: 'Depreciación Acumulada es Activo pero es cuenta contraria: se mueve al crédito y resta del valor del equipo. Nunca se toca la cuenta Equipo directamente, así conservas el costo original y el desgaste por separado.',
  },
]

export const NIVELES = ['Básico', 'Intermedio', 'Avanzado']
