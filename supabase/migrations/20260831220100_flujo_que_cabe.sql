-- El flujo de la lámina de earnout y escrow, otra vez corto.
--
-- Al reescribir la baraja le puse a los cuatro nodos el momento en que ocurre
-- cada cosa: «Se firma», «Se cierra y se paga», «Escrow · meses», «Earnout ·
-- años». Con eso la fila deja de caber y la lámina sale con barra horizontal.
-- `formas.md` ya lo advierte: en `flujo` van de dos a cuatro nodos y más no
-- cabe, y eso incluye el ancho de cada uno.
--
-- El dato no se pierde, se muda: los meses del escrow ya estaban en el
-- segundo párrafo y los años del earnout entran ahora en el primero, que es
-- donde se puede escribir sin pelear con el ancho.

update public.laminas l set
  cuerpo = '[
    {"tipo":"p","texto":"Un earnout es una parte del precio que solo se paga si el negocio cumple ciertas metas en los años siguientes a la compra. Resuelve que las dos partes proyecten crecimientos distintos: así ninguno tiene que aceptar el número del otro."},
    {"tipo":"p","texto":"Un escrow es otra parte que queda guardada en un banco unos meses y se libera solo si lo que el vendedor declaró resulta cierto. Cubre las sorpresas: un pleito que no contó, una licencia mal cedida."}
  ]'::jsonb,
  datos = '{"nodos":[{"texto":"Firma"},{"texto":"Cierre"},{"texto":"Escrow"},{"texto":"Earnout"}]}'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 6;
