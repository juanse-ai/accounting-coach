# Partida doble · práctica de asientos y cuentas T

Aplicación de una sola página para practicar partida doble: se lee un hecho
económico, se arma el asiento línea por línea y se verifica contra la respuesta
esperada. Herramienta de aprendizaje personal, en español.

## Correr

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción en dist/
npm run preview  # servir el build
```

## Cómo está organizado

```
src/
  data/planCuentas.js         Plan de cuentas: nombre, cuenta padre y por qué pertenece ahí.
  data/ejercicios.js          Los 18 ejercicios: hecho, líneas esperadas y nota explicativa.
  logica/verificar.js         Comparación sin importar el orden + totales de la balanza.
  hooks/useProgreso.js        Persistencia en localStorage, tolerante a fallos.
  componentes/                Backlog, LineaAsiento, Balanza, Retroalimentacion, CuentasT.
  componentes/LogoFailFast    Lockup de marca, recoloreado para fondo negro.
  estilos/fail-fast-tokens.css Tokens del design system de Fail Fast (dark only).
  estilos.css                 Estilos de la app, construidos sobre esos tokens.
```

## Design system

La interfaz usa el **design system de Fail Fast**: negro puro de página, superficies
que suben por escalones (`#141416` → `#161618` → `#1c1c1f`), hairlines de `#2a2a2e`
en vez de sombras, Inter empaquetada con `@fontsource` (no CDN), serif del sistema
para el display editorial, cabecera píldora flotante con vidrio esmerilado, radios
de 6 px en inputs / 10 px en botones / 12–16 px en tarjetas, y motion en
`cubic-bezier(0.22, 1, 0.36, 1)` a 220 ms.

`src/estilos/fail-fast-tokens.css` es un recorte literal de `colors_and_type.css`
del sistema: solo los tokens que esta app usa, sin valores alterados. Si el sistema
cambia, ese es el único archivo a resincronizar.

**Dos extensiones deliberadas**, ambas documentadas en la cabecera de `estilos.css`:

1. **Débito y Crédito toman la escala semántica, no el primario.** Débito usa la
   familia `--ff-info` (azul) y Crédito la familia `--ff-accent-plum` (ciruela);
   acierto y error usan `--ff-success` y `--ff-danger`. Así `--ff-primary` conserva
   su único trabajo según el sistema: la CTA "Verificar asiento". La escala semántica
   existe justamente para color que carga significado, que es lo que el par
   débito/crédito hace en toda la app. El ámbar (`--ff-warn`) queda reservado para lo
   que no es un lado: nivel Intermedio, ejercicio intentado con errores y el aviso de
   asiento incompleto.

   El sistema define `--ff-accent-plum`, `-bg` y `-border` pero no el hermano claro
   para texto que sí tienen las otras familias. Se deriva en
   `fail-fast-tokens.css` como `--ff-accent-plum-fg: #c49ad2`, con el mismo salto de
   luminosidad que usan warn e info. Si el sistema publica el suyo, se borra esa línea.

   **Nota de contraste:** el azul y el ciruela contrastan bien contra el fondo (7.0–8.8)
   pero muy poco entre sí (1.15), porque casi no difieren en luminosidad. Por eso el
   lado nunca depende solo del color: las píldoras llevan una flecha direccional, la
   columna del monto está rotulada, y en la cuenta T la posición izquierda/derecha es
   la que manda. Si quieres más separación, subir `--ff-accent-plum-fg` a un ciruela
   más oscuro es un cambio de una línea.

2. **Las columnas de cifras usan `--ff-font-mono`.** El sistema reserva la mono para
   tokens y código; aquí se extiende a montos, sumas y numeración porque en un libro
   contable la alineación de columnas es información, no estilo. La alternativa
   estricta sería `.ff-num` (Inter con `tabular-nums`), que alinea igual — es un
   cambio de una línea si prefieres adherencia total.

Dos cosas del brief original quedaron sobrescritas por el sistema: el fondo dejó de
ser tinta azulada y pasó a negro puro (el sistema es dark-only sobre `#000000`), y
la mono dejó de ser JetBrains Mono para ser la pila `ui-monospace` del sistema.
Tampoco se usa el gradiente de marca: el sistema permite uno por página y solo en un
titular hero, y esta herramienta no tiene hero — el acento ya vive en el logo y la CTA.

El logo viene de `failfast-logo-black.svg`. Sobre negro, sus dos colores se resuelven
como el sistema indica: el lockup `#222222` pasa a `currentColor` (blanco) y el
acento `#4867FF` sube al primario de modo oscuro `#5c78ff`.

## Decisiones que no son accidentales

**La cuenta padre no se autocompleta.** Al elegir "Caja" el selector de cuenta
padre queda vacío. `planCuentas.js` sabe que Caja es Activo, pero ese dato solo
lo consume la verificación: clasificar es lo que se está practicando. Por la
misma razón el selector de cuentas es una lista plana alfabética y no está
agrupada por categoría — agruparla regalaría la respuesta.

**La balanza no valida el asiento.** Solo suma débitos y créditos. Un asiento
puede cuadrar perfectamente con las cuentas equivocadas, y la interfaz lo deja
pasar a propósito: el texto bajo la balanza lo dice explícitamente.

**La retroalimentación no revela la respuesta.** Cuando hay error se señala qué
está mal en cada línea (cuenta padre, lado, monto, cuenta que sobra). Si falta
una línea se dice el lado pero nunca la cuenta. Las cuentas T y la nota
explicativa solo aparecen cuando el asiento está correcto.

**El lado se lee sin depender del color.** Los dos botones de lado son píldoras
con una flecha que apunta a la columna donde caerá el monto en la cuenta T: `←`
para Débito, `→` para Crédito. La flecha es la señal no cromática del lado, y
además enseña la geometría de la T antes de que el usuario la vea dibujada.

**Vocabulario fijo.** "Débito" y "Crédito" en toda la interfaz, nunca
"Debe"/"Haber". Azul para débito y ciruela para crédito en botones, balanza y
cuentas T; verde solo para acierto, rojo solo para error. Las cifras y la
numeración van en monoespaciada para que las columnas alineen como en un libro
contable; los rótulos van en Inter, neutros, según la regla de etiquetas de
sección del sistema.

**El progreso puede fallar sin romper nada.** Lectura y escritura de
localStorage están envueltas en `try/catch`; si el almacenamiento está
bloqueado o el dato guardado está corrupto, la app arranca limpia y sigue
funcionando en memoria.

## Sobre el ejercicio 05

El enunciado original de este ejercicio llegó truncado: se perdieron las líneas
del asiento y el comienzo de la nota. Se reconstruyó de la única forma que el
hecho económico admite (abonar 500.000 en efectivo a un proveedor: Cuentas por
Pagar al débito contra Caja al crédito) y se completó la nota a partir del
fragmento que sobrevivió. La línea queda marcada con `reconstruido: true` en
`src/data/ejercicios.js` para poder revisarla contra la fuente. Los otros 17
ejercicios son literales.
