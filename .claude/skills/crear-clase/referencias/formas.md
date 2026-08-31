# Las formas de la presentación

Cada lámina lleva **o** una forma (`visual` + `datos`) **o** una imagen
(`imagen`), nunca las dos, salvo `flujo`, que puede intercalar la imagen de la
lámina en el medio.

Las formas viven en `src/componentes/Diagramas.jsx`. Dibujan una estructura, no
un tema: la misma tabla sirve para las cinco familias contables y para comparar
tres adquisiciones. Si el contenido no entra en ninguna, casi siempre es que hay
que replantear la lámina, no agregar una forma.

---

## `marcas`: logos, con dato al pie

```js
{ items: [{ src, alt, pie?, escala? }], separador?: '×', pie?: 'texto al pie' }
```

Los logos van sobre placa blanca. **No es decoración**: una marca viene dibujada
para fondo claro y sobre el negro de la baraja la mitad desaparece.

El tamaño y las columnas salen de cuántos items hay: dos son una portada
(grandes, una columna), cuatro o más son un muro (chicos, dos columnas). No se
configura.

**Usa logotipos horizontales, no iconos cuadrados.** Todos se dibujan a la misma
altura, así que un logotipo alargado y una insignia cuadrada acaban pesando muy
distinto: la insignia se ve como una estampilla perdida en medio de la placa.
Si te dan un avatar cuadrado, busca el logotipo de la misma marca en Commons.

**`escala` corrige el aire de cada archivo.** Dos logos a la misma altura pueden
verse de tamaños muy distintos, porque uno trae margen dibujado dentro de su
propio SVG y el otro no. `escala: 1.4` agranda ese logo un 40% sin tocar a los
demás. Es ajuste óptico: se iguala cómo se ven, no cuánto miden. Úsalo solo
cuando mirando la lámina se note, nunca por defecto.

Es la forma más rentable cuando el dato *es* la marca:

- **Portada**: dos logos con `separador: '×'`.
- **Una ronda de inversión**: seis u ocho logos, `pie` general con la fecha.
- **Un historial**: tres logos, cada uno con su `pie`: `'2022 · USD 40.000 M ·
  abandonada'`. Ahí la imagen carga el dato y el párrafo se libera.

## `balance`: dos columnas enfrentadas

```js
{ columnas: [{ rotulo, filas: [{ cuenta, monto }], total }],   // exactamente dos
  signo?: '=', sello?: 'Los totales coinciden' }
```

Para comparar dos lados: débitos contra créditos, antes contra después, lo
pagado contra lo recibido. Los montos son texto, ya formateados. La columna es
angosta y recorta con puntos suspensivos: etiquetas cortas.

## `tabla`: encabezados y filas

```js
{ columnas: [{ rotulo, sentido?: 'arriba' | 'abajo' }],
  filas: [{ celdas: [{ texto, tono?, flecha? }] }] }
```

La primera celda de cada fila es su encabezado. `tono` es `'info'` (azul),
`'ciruela'` o `'neutro'`; `flecha` es `'izquierda' | 'derecha' | 'arriba' |
'abajo'`. El color nunca va solo: la palabra siempre está.

Tres columnas y cuatro o cinco filas es el techo cómodo.

## `flujo`: nodos encadenados

```js
{ nodos: [{ texto }], imagenEnMedio?: true }
```

Una secuencia con flechas: Firma → Cierre → Escrow → Earnout. Con
`imagenEnMedio` y una `imagen` en la lámina, la foto se intercala en el centro.
Dos a cuatro nodos; más no cabe.

## `partido`: una hoja partida en dos

```js
{ mitades: [{ rotulo }, { rotulo }], reglas?: true }
```

Exactamente dos mitades rotuladas, con renglones opcionales. Para una oposición
sin cifras: identificable contra goodwill, débito contra crédito.

## `registro`: un libro de una columna

```js
{ titulo, filas: [{ signo?: '+' | '−', texto?, monto, marca? }],
  pie: { rotulo, valor } }
```

Filas con signo (verde entra, rojo sale) o sin él (neutras). Con `texto` la fila
crece a cuatro columnas y el texto envuelve.

## `bloqueT`: un bloque en T

```js
{ nombre, lados: [{ rotulo }, { rotulo }], pie }
```

Nombre arriba, dos lados, un pie. Nació como la cuenta T contable y sirve para
cualquier cosa que se parta en dos bajo un título con un total abajo.

---

# Imágenes

```js
imagen: { src, alt, encuadre?: 'cubrir' | 'contener', credito? }
```

`cubrir` recorta para llenar; `contener` muestra entera: para verticales, poca
resolución, cualquier logo y **siempre para una captura de pantalla**. Una foto
sobrevive a que le corten los bordes; una captura no, porque lo que la hace
útil suele estar justo en la cabecera.

## Reglas

1. **Se enlazan, no se descargan.** El repo no guarda imágenes nuevas.
2. **Verifica la URL antes de usarla.** `curl -sIL` y mira que devuelva 200 y
   un `content-type` de imagen. Nunca inventes una URL de Wikimedia: búscala
   con su API (`commons.wikimedia.org/w/api.php`) y copia la que devuelva.
   Wikimedia pide un `User-Agent` que te identifique y responde **429** si le
   pides muchas seguidas; un 429 no dice nada de la URL, solo que hay que
   esperar.
3. **Miniatura, no original.** Un original de Wikimedia puede pesar varios MB y
   no alcanza a aparecer. Usa la ruta de miniatura:
   ```
   https://upload.wikimedia.org/wikipedia/commons/thumb/<a>/<ab>/<archivo>/960px-<archivo>
   ```
   **El ancho no es libre.** Wikimedia dejó de generar miniaturas a pedido y
   ahora responde **400** a un ancho que no esté en su lista; 480, 640 y 800
   fallan. Los que sirven de forma fiable son **500** (bien para un retrato) y
   **960** (bien para una foto ancha). Si dudas, pídele el ancho a la API y
   copia el `thumburl` que devuelva, quitándole los parámetros de rastreo:
   ```
   iiprop=imageinfo&iiurlwidth=500
   ```
   Un 400 aquí no dice nada del archivo, solo del ancho que pediste.

   Los SVG no llevan miniatura: pesan poco y escalan solos.
   `generar.mjs --verificar-imagenes` marca cualquier raster de más de 300 KB.
4. **Wikimedia Commons primero**: estable, libre y con miniaturas. Si te dan una
   URL, úsala igual, pero verifícala.
   Para la interfaz de un producto no vas a encontrar nada ahí: abre el sitio,
   captúralo y guárdalo en `public/clases/`. Recórtalo con `ffmpeg -vf
   crop=ancho:alto:x:y`, que corta desde la esquina que le digas — `sips
   --cropToHeightWidth` recorta desde el centro y se come la cabecera, que es
   justo lo que querías enseñar. Y ponle la fecha en el `credito`: la interfaz
   de hoy no es la de dentro de seis meses.
5. **Si la licencia pide crédito, ponlo en `credito`.** Los logotipos suelen ser
   marcas registradas sin derechos de autor y no lo necesitan, pero una
   fotografía de Commons es casi siempre Creative Commons y obliga a acreditar
   a quien la hizo. Va debajo de la imagen, en pequeño:
   `credito: 'Die del LPU · Avivweinstein · CC BY-SA 4.0'`. Si una imagen pide
   crédito y no hay dónde ponerlo, la salida honesta es no usarla.
6. **El `alt` describe, no rotula.** «Una tarjeta gráfica NVIDIA con tres
   ventiladores, vista de frente», no «GPU». Cuando la imagen no carga, ese
   texto ocupa su lugar en pantalla: tiene que decir lo que la imagen decía.


---

# Fotos en una pregunta

Las formas de arriba son de la presentación. Una pregunta tiene su propio
apoyo visual, y es uno solo: una fila de caras.

```js
apoyo: { retratos: [{ src, alt, pie? }], credito? }   // 1 a 6
```

Vive en la columna `preguntas.apoyo` y lo dibuja `src/componentes/Retratos.jsx`,
no `Diagramas.jsx`. La separación no es capricho: las formas de la baraja
pintan con las variables `--dk-*`, que están declaradas sobre `.aprende` y no
existen fuera del diálogo, así que dibujar una dentro del quiz la dejaría sin
color.

Sirve cuando la pregunta ES la imagen: «estas tres personas fundaron X, ¿cómo
se llaman?». Para todo lo demás, el enunciado solo.

- **El `pie` de cada cara es opcional a propósito.** Si la pregunta pide los
  nombres, rotular las caras es regalar la respuesta. Déjalo fuera.
- **El `alt` describe sin nombrar**, por lo mismo: «un hombre mayor de pelo y
  barba blancos, ante un micrófono», no «Chris Malachowsky».
- **El `credito` es uno solo para toda la fila.** Las fotos de personas suelen
  ser Creative Commons y de autores distintos, y cada una obliga a acreditar:
  van todas en esa línea. Si de alguien no hay foto libre, la salida honesta es
  enseñar las que sí hay y decirlo en la `nota`.
