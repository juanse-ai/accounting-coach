-- La tabla del múltiplo, más angosta.
--
-- «Precio dividido entre ingresos» como encabezado de fila empujaba la tabla
-- 13 px por fuera de su columna, y la lámina salía con barra horizontal. El
-- signo ÷ dice lo mismo en cuatro caracteres, y el párrafo de al lado ya
-- explica la división con todas sus letras: la tabla no tiene que repetirla.

update public.laminas l set datos = '{
    "columnas":[{"rotulo":""},{"rotulo":"2023 · La ronda"},{"rotulo":"2026 · La compra"}],
    "filas":[
      {"celdas":[{"texto":"Precio"},{"texto":"USD 4.500 M"},{"texto":"USD 12.900 M","tono":"ciruela","flecha":"arriba"}]},
      {"celdas":[{"texto":"Ingresos del año"},{"texto":"No divulgados"},{"texto":"~USD 150 M"}]},
      {"celdas":[{"texto":"Precio ÷ ingresos"},{"texto":"Más de 100 veces"},{"texto":"Unas 86 veces","tono":"info","flecha":"abajo"}]}
    ]
  }'::jsonb
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 5;
