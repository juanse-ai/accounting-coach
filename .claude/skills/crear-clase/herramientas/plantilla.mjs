/**
 * Plantilla de una clase. Cópiala, cámbiale todo y genera la migración:
 *
 *   node generar.mjs mi-clase.mjs --verificar-imagenes
 *
 * Tal como está es una clase válida y minúscula: sirve de ejemplo y de prueba
 * del generador. Antes de escribir de verdad, lee `referencias/escritura.md`
 * (qué hace buena a una lámina y mala a una pregunta) y `referencias/formas.md`
 * (las siete formas y qué datos pide cada una).
 */

export const clase = {
  slug: 'clase-de-ejemplo',          // minúsculas y guiones; es la URL y la clave guardada
  nombre: 'Clase de ejemplo',        // lo que dice el selector y el <h1>
  etiqueta: 'Plantilla',             // el rótulo pequeño del landing
  titular: 'Una clase cabe en cinco inserts.',   // el titular del landing
  bajada: 'Cuatro láminas y tres preguntas que muestran las formas y los dos tipos de pregunta.',
  orden: 99,                         // posición en el selector
}

export const laminas = [
  {
    // Portada: dos logos sobre placa clara. `marcas` es la forma que más
    // rinde cuando el dato ES la marca.
    etiqueta: 'De qué va',
    titulo: [{ t: 'Una clase ' }, { t: 'de ejemplo', acento: true }],
    cuerpo: [
      { tipo: 'p', texto: 'Dos párrafos por lámina. Si uno se puede borrar sin perder un dato ni un argumento, sobraba.' },
    ],
    visual: 'marcas',
    datos: {
      items: [
        { src: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg', alt: 'Logo de Salesforce.' },
        { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg', alt: 'Logo de Amazon.' },
      ],
      separador: '×',
      pie: 'El pie es donde va la fuente y la fecha.',
    },
  },
  {
    // Una foto en vez de una forma. Siempre miniatura, nunca el original.
    etiqueta: 'Con imagen',
    titulo: [{ t: 'La imagen ' }, { t: 'carga el dato', acento: true }],
    cuerpo: [
      { tipo: 'p', texto: 'Lo que se puede enseñar no se cuenta: cada dato que sube al visual libera una línea del párrafo.' },
      { tipo: 'lista', items: ['Verifica la URL con curl', 'Usa la miniatura de Wikimedia', 'Escribe un alt que describa'] },
    ],
    visual: null,
    datos: {},
    imagen: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/MSI_GeForce_RTX_3070_VENTUS_3X_OC.jpg/960px-MSI_GeForce_RTX_3070_VENTUS_3X_OC.jpg',
      alt: 'Una tarjeta gráfica con tres ventiladores, vista de frente.',
      encuadre: 'cubrir',
    },
  },
  {
    // `fichas` sustituye a un párrafo de enumeración y ocupa la mitad.
    etiqueta: 'Bloques del cuerpo',
    titulo: [{ t: 'Párrafo, lista y ' }, { t: 'fichas', acento: true }],
    cuerpo: [
      { tipo: 'p', texto: 'Tres bloques y ya. Las fichas ponen una píldora corta al lado de cada renglón.' },
      { tipo: 'fichas', leyenda: 'sirve para', items: [
        { texto: 'Párrafo', ficha: 'Explicar', tono: 'info' },
        { texto: 'Lista', ficha: 'Enumerar', tono: 'ciruela' },
        { texto: 'Fichas', ficha: 'Comparar', tono: 'neutro' },
      ] },
    ],
    visual: 'tabla',
    datos: {
      columnas: [{ rotulo: 'Forma' }, { rotulo: 'Sirve para', sentido: 'arriba' }],
      filas: [
        { celdas: [{ texto: 'balance' }, { texto: 'Enfrentar dos lados', tono: 'info' }] },
        { celdas: [{ texto: 'flujo' }, { texto: 'Encadenar pasos', tono: 'ciruela' }] },
        { celdas: [{ texto: 'marcas' }, { texto: 'Mostrar logos', tono: 'neutro' }] },
      ],
    },
  },
  {
    etiqueta: 'Cierre',
    titulo: [{ t: 'Y una ' }, { t: 'secuencia', acento: true }],
    cuerpo: [{ tipo: 'p', texto: 'Escribir el contenido, generar, aplicar, verificar. En ese orden.' }],
    visual: 'flujo',
    datos: { nodos: [{ texto: 'Escribir' }, { texto: 'Generar' }, { texto: 'Aplicar' }, { texto: 'Verificar' }] },
  },
]

// Solo hace falta si alguna pregunta es de tipo `asiento`. Si no, déjalo vacío.
export const cuentas = [
  { nombre: 'Caja', padre: 'Activo', contraria: false, razon: 'es dinero que el negocio ya controla' },
  { nombre: 'Capital Social', padre: 'Patrimonio', contraria: false, razon: 'es lo que el dueño aportó al negocio' },
  { nombre: 'Cuentas por Pagar', padre: 'Pasivo', contraria: false, razon: 'es una deuda con un proveedor' },
]

export const preguntas = [
  {
    codigo: '01',
    tipo: 'opcion',
    nivel: 'Básico',
    enunciado: '¿Dónde vive el contenido de una clase en esta app?',
    // La correcta no siempre va primero: varía la posición entre preguntas.
    datos: {
      opciones: [
        { texto: 'En archivos JavaScript dentro de src/data/.', correcta: false },
        { texto: 'En Supabase: publicar una clase es insertar filas.', correcta: true },
        { texto: 'En archivos Markdown que el build convierte en componentes.', correcta: false },
        { texto: 'En el localStorage de cada participante.', correcta: false },
      ],
    },
    nota: 'En la base. El frontend sabe dibujar siete formas y calificar dos tipos de pregunta, y nada más: por eso una clase nueva no toca src/. Los distractores son las tres arquitecturas que uno esperaría encontrar, y que esta app tuvo que dejar atrás para poder tener más de una clase.',
  },
  {
    codigo: '02',
    tipo: 'opcion',
    nivel: 'Intermedio',
    enunciado: 'Una pregunta de opción múltiple queda con dos respuestas marcadas como correctas. ¿Qué pasa?',
    datos: {
      opciones: [
        { texto: 'El motor acepta cualquiera de las dos como buena.', correcta: false },
        { texto: 'La base la rechaza al insertarla.', correcta: false },
        { texto: 'Nada malo: el generador aborta antes, porque una pregunta así es incalificable.', correcta: true },
        { texto: 'Se muestra solo la primera y la otra se ignora.', correcta: false },
      ],
    },
    nota: 'El CHECK de la base solo cuenta cuántas opciones hay, no cuántas están marcadas; el motor daría por buena una y por mala la otra sin avisar. Por eso la validación vive en el generador: es el último punto donde el error todavía es barato.',
  },
  {
    codigo: '03',
    tipo: 'asiento',
    nivel: 'Básico',
    enunciado: 'El dueño aporta 1.000.000 al negocio y los deposita en la caja.',
    // Las cuentas tienen que existir arriba, y los débitos igualar a los créditos.
    datos: {
      lineas: [
        { cuenta: 'Caja', padre: 'Activo', lado: 'Débito', monto: 1000000 },
        { cuenta: 'Capital Social', padre: 'Patrimonio', lado: 'Crédito', monto: 1000000 },
      ],
    },
    nota: 'Entra dinero al negocio (activo sube, débito) y el dueño adquiere un derecho sobre él (patrimonio sube, crédito). El negocio y la persona son entidades distintas: por eso el aporte crea una obligación del negocio hacia su dueño.',
  },
]

export default { clase, laminas, cuentas, preguntas }
