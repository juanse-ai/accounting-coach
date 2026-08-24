/**
 * Contenido de la presentación "Aprende" — 12 láminas sobre la ecuación
 * contable, la partida doble y las cuentas T.
 *
 * El título no es una cadena sino una lista de segmentos. El sistema pide que
 * una palabra de cada título vaya en el acento, y partir la cadena por
 * coincidencia de texto se rompe con tildes, con la palabra repetida y con los
 * signos de la ecuación. Marcarlo aquí es explícito y no tiene casos borde.
 *
 * El cuerpo son bloques y no un párrafo suelto porque tres láminas alternan
 * prosa y lista numerada, y la numeración es contenido (01, 02, 03), no viñeta.
 *
 * `visual` nombra un diagrama construido en el propio componente; `imagen` es
 * una foto en public/aprende/. La lámina 8 lleva las dos: la foto va dentro
 * del diagrama.
 */

export const LAMINAS = [
  {
    id: '01',
    etiqueta: 'Contabilidad for dummies',
    titulo: [{ t: 'Contabilidad ' }, { t: '1:1', acento: true }],
    cuerpo: [{ tipo: 'p', texto: 'De la ecuación contable a las cuentas T, en 12 pasos.' }],
    imagen: {
      src: '/aprende/01-patrick.webp',
      alt: 'Patrick y Bob Esponja sentados en la arena frente a un juego de mesa con billetes y una caja registradora.',
    },
  },
  {
    id: '02',
    etiqueta: 'El problema',
    titulo: [{ t: 'Entrada ' }, { t: 'Simple', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Durante siglos los comerciantes llevaron entradas y salidas de dinero en una sola columna. Si la caja sube 1.000, ese libro no distingue entre tres hechos completamente distintos:',
      },
      { tipo: 'lista', items: ['Lo gané vendiendo', 'Me lo prestaron', 'Vendí una máquina'] },
      { tipo: 'p', texto: 'Tres realidades opuestas, el mismo registro.' },
    ],
    visual: 'entradaSimple',
  },
  {
    id: '03',
    etiqueta: 'Fundamento',
    titulo: [{ t: 'Activos', acento: true }, { t: ' = Pasivos + Patrimonio' }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Todo lo que un negocio posee fue financiado de una de dos formas: con plata de terceros, o con plata de los dueños. No hay una tercera opción. Por eso la ecuación siempre cuadra.',
      },
    ],
    imagen: {
      src: '/aprende/03-krusty.jpg',
      alt: 'El Crustáceo Cascarudo de noche, iluminado, con su letrero en forma de concha al lado.',
    },
  },
  {
    id: '04',
    etiqueta: 'Fundamento',
    titulo: [{ t: 'Patrimonio', acento: true }, { t: ' = Activos − Pasivos' }],
    cuerpo: [
      {
        tipo: 'p',
        texto: 'Lo que realmente es mío es todo lo que tengo, menos todo lo que debo.',
      },
    ],
    imagen: {
      src: '/aprende/04-patrimonio.jpg',
      alt: 'Don Cangrejo abrazando y oliendo un fajo de billetes con cara de felicidad.',
      encuadre: 'contener',
    },
  },
  {
    id: '05',
    etiqueta: 'Fundamento',
    titulo: [{ t: 'Pasivos', acento: true }, { t: ' = Activos − Patrimonio' }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Los pasivos son la parte de tus activos que no es realmente tuya. Tú eres el poseedor, pero otro es el dueño.',
      },
    ],
    imagen: {
      src: '/aprende/05-caja.webp',
      alt: 'Inauguración del Banco de Fondo de Bikini: una fila de peces espera frente a la cinta roja.',
    },
  },
  {
    id: '06',
    etiqueta: 'Historia · Siglo XV',
    titulo: [{ t: 'El método ' }, { t: 'veneciano', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'En la Venecia del Renacimiento, el comercio marítimo movía capital de decenas de socios, en varias monedas, a través de rutas de meses. La partida simple no aguantaba esa complejidad.',
      },
      {
        tipo: 'p',
        texto:
          'Los mercaderes italianos llevaban ya cerca de dos siglos desarrollando una alternativa: registrar dos veces cada transacción.',
      },
    ],
    imagen: {
      src: '/aprende/06-venecia.jpg',
      alt: 'Pintura de Canaletto del Bacino de San Marcos en Venecia, lleno de góndolas frente al Palacio Ducal.',
    },
  },
  {
    id: '07',
    etiqueta: 'Historia · 1494',
    titulo: [{ t: 'Un fraile lo puso ' }, { t: 'por escrito', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Luca Pacioli, matemático, publicó en Venecia la Summa de Arithmetica. No inventó la partida doble: documentó lo que los mercaderes ya hacían — y al imprimirlo, lo volvió estándar en toda Europa.',
      },
      {
        tipo: 'p',
        texto:
          'Es la razón por la que hoy, 500 años después, seguimos usando el mismo sistema.',
      },
    ],
    imagen: {
      src: '/aprende/07-pacioli.jpg',
      alt: 'Retrato de Luca Pacioli con hábito de fraile, señalando una figura geométrica sobre una pizarra junto a un libro abierto.',
      encuadre: 'contener',
    },
  },
  {
    id: '08',
    etiqueta: 'Partida doble',
    titulo: [{ t: 'Todo hecho económico cambia ' }, { t: 'dos cosas', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Nunca entra dinero solo. Entra dinero y nace una obligación. O entra dinero y se genera un ingreso. La partida doble registra la causa y el efecto como dos anotaciones simultáneas, en lados opuestos y por el mismo monto.',
      },
      {
        tipo: 'p',
        texto:
          'Ahí está la respuesta que la partida simple no podía dar: no solo cuánto se movió, sino por qué.',
      },
    ],
    visual: 'causaEfecto',
    imagen: {
      src: '/aprende/08-causa.jpg',
      alt: 'Bob Esponja en versión realista y desgastada, fumando un cigarrillo con cara de cansancio.',
    },
  },
  {
    id: '09',
    etiqueta: 'Partida doble',
    titulo: [{ t: 'Un sistema que ' }, { t: 'se verifica solo', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Si cada transacción registra débitos iguales a créditos, entonces en todo el libro los débitos totales deben igualar a los créditos totales. Siempre. Sin excepción.',
      },
      { tipo: 'p', texto: 'Cuando no cuadra, hay un error.' },
    ],
    visual: 'verificacion',
  },
  {
    id: '10',
    etiqueta: 'Concepto clave',
    titulo: [{ t: 'Débito y crédito son solo una ' }, { t: 'posición', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Débito no significa bueno. Crédito no significa malo. No significan nada por sí solos. Débito es la anotación de la izquierda. Crédito es la de la derecha.',
      },
      {
        tipo: 'p',
        texto:
          'Vienen del latín debere y credere, y de ahí salen esos términos: deudores a la izquierda, acreedores a la derecha. Lo que un débito hace depende únicamente de qué tipo de cuenta esté tocando.',
      },
    ],
    visual: 'mayorPartido',
  },
  {
    id: '11',
    etiqueta: 'Concepto clave',
    titulo: [{ t: 'Cinco familias, ' }, { t: 'dos lados', acento: true }],
    cuerpo: [
      {
        tipo: 'p',
        texto: 'Cada cuenta pertenece a una de cinco familias, y cada familia vive de un lado:',
      },
      {
        tipo: 'lista',
        items: [
          'Activos — aumentan al débito',
          'Gastos — aumentan al débito',
          'Pasivos — aumentan al crédito',
          'Patrimonio — aumentan al crédito',
          'Ingresos — aumentan al crédito',
        ],
      },
      {
        tipo: 'p',
        texto:
          'No hay que memorizarlo: sale de la ecuación. Los activos están a la izquierda, así que crecen por la izquierda.',
      },
    ],
    visual: 'tablaFamilias',
  },
  {
    id: '12',
    etiqueta: 'Cuentas T',
    titulo: [{ t: 'La ' }, { t: 'herramienta', acento: true }, { t: ' de trabajo' }],
    cuerpo: [
      {
        tipo: 'p',
        texto:
          'Una cuenta T es una sola cuenta dibujada como su libro mayor: nombre arriba, débitos a la izquierda, créditos a la derecha, saldo abajo del lado que corresponda.',
      },
      {
        tipo: 'p',
        texto: 'Es el borrador con el que piensa un contador antes de escribir un asiento.',
      },
    ],
    visual: 'cuentaT',
  },
]

/**
 * Lámina 11. Se guarda aquí y no dentro del diagrama porque es la misma regla
 * que enumera el cuerpo: si una cambia, tienen que cambiar las dos juntas.
 *
 * No hay columna de "saldo normal": para las cinco familias el saldo normal y
 * el lado que aumenta son el mismo dato, y verlo dos veces hacía dudar de si
 * decían cosas distintas.
 */
export const FAMILIAS = [
  { familia: 'Activos', aumenta: 'Débito', disminuye: 'Crédito' },
  { familia: 'Gastos', aumenta: 'Débito', disminuye: 'Crédito' },
  { familia: 'Pasivos', aumenta: 'Crédito', disminuye: 'Débito' },
  { familia: 'Patrimonio', aumenta: 'Crédito', disminuye: 'Débito' },
  { familia: 'Ingresos', aumenta: 'Crédito', disminuye: 'Débito' },
]

/**
 * Lámina 9. Cifras de juguete cuyo único trabajo es sumar igual a ambos lados:
 * el diagrama enseña que los totales coinciden, no un asiento en particular.
 */
export const VERIFICACION = {
  debitos: [
    { cuenta: 'Caja', monto: '1.200.000' },
    { cuenta: 'Inventario', monto: '450.000' },
    { cuenta: 'Gasto arriendo', monto: '350.000' },
  ],
  creditos: [
    { cuenta: 'Obligación bancaria', monto: '1.000.000' },
    { cuenta: 'Ingreso por ventas', monto: '800.000' },
    { cuenta: 'Proveedores', monto: '200.000' },
  ],
  total: '2.000.000',
}
