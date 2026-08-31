---
name: crear-clase
description: Crear o editar una clase de esta app (su presentación de láminas y su quiz) en Supabase. Úsalo cuando pidan una clase nueva sobre cualquier tema, más preguntas o láminas para una que ya existe, o reescribir las que hay. El contenido vive en la base, no en el código: publicar una clase es insertar filas, nunca tocar src/.
---

# Crear una clase

Una clase es una fila en `clases` con tres cosas colgando: `laminas` (la
presentación), `preguntas` (el quiz) y, si el quiz pide armar asientos
contables, `cuentas` (su plan de cuentas). Una pregunta puede además llevar
`apoyo`: una fila de caras debajo del enunciado, para cuando la pregunta ES la
imagen. Está en `referencias/formas.md`.

**El frontend no sabe de ningún tema.** Sabe dibujar seis formas y calificar
dos tipos de pregunta. Si te dan ganas de tocar `src/` para publicar una clase,
casi siempre es que estás forzando el contenido a una forma equivocada, o que
hace falta una forma nueva, que es una decisión aparte y más grande.

## El recorrido

1. **Investiga antes de escribir.** Si la clase habla de hechos (una compra,
   una ley, una empresa), búscalos y quédate con la fuente y la fecha. Lo que no
   puedas verificar no va como dato: va rotulado como supuesto, dentro del
   propio enunciado.
2. **Escribe el contenido** en un módulo JS copiado de
   `herramientas/plantilla.mjs`. Lee `referencias/escritura.md` antes: dice qué
   hace buena a una lámina y qué hace mala a una pregunta.
3. **Elige las formas** con `referencias/formas.md`. Cada lámina dibuja una
   forma o una imagen, nunca las dos.
4. **Genera la migración**: `node herramientas/generar.mjs mi-clase.mjs --verificar-imagenes`
   Valida todo y escribe el `.sql` en `supabase/migrations/`. Si algo está mal,
   aborta y te dice qué.
5. **Aplica** con `mcp__supabase__apply_migration`, pegando el contenido del
   archivo generado. El repo y la base tienen que decir lo mismo.
6. **Verifica** llamando `clase_completa('<slug>')` y abriendo la app: el
   selector de clase, las láminas con sus flechas y una pregunta acertada y
   otra errada.

## Reglas que no se negocian

- **Nada de contenido en `src/`.** Ni un texto, ni una cifra, ni una URL.
- **Una sola opción correcta** por pregunta de tipo `opcion`. El generador lo
  verifica; si fallara, la pregunta sería incalificable.
- **Los asientos cuadran**: la suma de los débitos iguala la de los créditos, y
  toda cuenta usada existe en el plan de la clase. También lo verifica.
- **Nunca borres preguntas con respuestas enviadas.** `respuestas` cae en
  cascada. Si vas a reemplazarlas, cuenta primero:
  ```sql
  select count(*) from respuestas r
    join preguntas q on q.id = r.pregunta_id
    join clases c on c.id = q.clase_id
   where c.slug = '<slug>';
  ```
  Si no es cero, edita en sitio con `update`, o pon el guard que trae
  `20260831130000_preguntas_conceptuales_nvidia.sql`.
- **Migraciones append-only.** Nunca edites una ya aplicada: escribe otra.

## Editar una clase que ya existe

Un `update` por lámina o por pregunta, filtrando por `clase_id` + `orden` (o
`codigo`). `20260831140000_laminas_nvidia_con_imagenes.sql` es el ejemplo de
reescribir las doce láminas de una clase de una sentada.

## Dónde mirar cuando algo no cuadra

| Síntoma | Casi siempre es |
| --- | --- |
| La lámina no dibuja nada | `visual` nombra una forma que no está en el registro de `src/componentes/Diagramas.jsx` |
| Sale el texto alternativo en vez de la imagen | La URL murió, o es un original de Wikimedia de varios MB que no alcanzó a cargar |
| Un logo se pierde en el fondo | No lo pusiste en la forma `marcas`, que es la que lleva placa clara |
| «Esta versión no sabe presentar preguntas de tipo X» | `tipo` no coincide con ningún motor de `src/motores/` |
| Las caras de una pregunta no aparecen | `clase_completa` no está devolviendo `apoyo`, o la miniatura de Wikimedia pide un ancho que ya no existe |
| El quiz no muestra el plan de cuentas | Faltan filas en `cuentas` para esa clase |
