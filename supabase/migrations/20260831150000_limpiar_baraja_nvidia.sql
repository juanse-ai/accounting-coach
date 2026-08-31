-- La baraja de NVIDIA, limpia de ruido.
--
-- Cuatro cosas: tres que sobraban y una que se veía mal.
--
--  · El rótulo de cada lámina («El hecho · agosto 2026») repetía en pequeño
--    lo que el título ya decía en grande. `etiqueta` pasa a ser opcional y
--    esta clase la deja vacía; Contabilidad Básica la conserva, porque ahí
--    sí ordena la baraja («Fundamento», «Historia · 1494»).
--
--  · El pie de la portada, con la atribución completa, competía con los dos
--    logos. La fecha y el estado quedan en el párrafo, que es su sitio.
--
--  · Los guiones largos: el tic más delator de un texto escrito por una
--    máquina, y había dieciséis. Cada uno se cambia por el signo que la
--    frase pedía de verdad — dos puntos si lo que sigue explica, coma si es
--    un inciso, punto si eran dos frases disfrazadas de una.
--
--  · El logo de NVIDIA era el avatar cuadrado de su canal de YouTube, y al
--    lado del logotipo alargado de Hugging Face se veía como una estampilla.
--    Se cambia por el logotipo horizontal, de proporción parecida, que además
--    se lee parejo en el muro de la lámina 4.
--
-- Los reemplazos van sobre el texto que ya está guardado y no reescriben la
-- fila entera: así lo único que cambia es lo que está listado abajo.

alter table public.laminas alter column etiqueta drop not null;

do $$
declare
  cambios text[] := array[
    'Reportado, no firmado. Y así se analiza casi toda operación de M&A — antes de que exista del todo.', 'Reportado en agosto de 2026, sin acuerdo firmado. Así se analiza casi toda operación de M&A: antes de que exista del todo.',
    'Un estratégico suma lo que le hace a su propio negocio —la sinergia— y por eso paga más por exactamente lo mismo.', 'Un estratégico suma la sinergia: lo que la empresa le hace a su propio negocio. Por eso paga más por exactamente lo mismo.',
    'es lo contrario — y ahí empieza', 'es lo contrario, y ahí empieza',
    'no era cierto — un pleito que no contó', 'no era cierto: un pleito que no contó',
    'al resultado — por eso el goodwill', 'al resultado. Por eso el goodwill',
    'próximo comprador — como se ve', 'próximo comprador. Como se ve',
    'nada de eso —ni la comunidad, ni el hábito, ni el efecto de red—, y por eso', 'nada de eso: ni la comunidad, ni el hábito, ni el efecto de red. Por eso',
    'IBM Ventures —varios de ellos competidores entre sí— y ninguno quedó', 'IBM Ventures, varios de ellos competidores entre sí, y ninguno quedó',
    'siendo neutral — que es justamente', 'siendo neutral, que es justamente',
    'busca estratégicos — y por eso el regulador', 'busca estratégicos, y por eso el regulador',
    'cifra cierta —depende de dónde esté la acción— y los accionistas', 'cifra cierta, porque depende de dónde esté la acción, y los accionistas',
    'otra moneda —hay que definir la métrica, medirla durante años y aguantar la tentación de manipularla en ambos sentidos—, pero desatasca', 'otra moneda: hay que definir la métrica, medirla durante años y aguantar la tentación de manipularla en ambos sentidos. Pero desatasca',
    'montón de cosas —que no hay pleitos ocultos, que las licencias están en regla, que no hay pasivos sin declarar—: eso son', 'montón de cosas: que no hay pleitos ocultos, que las licencias están en regla, que no hay pasivos sin declarar. Eso son',
    'en garantía —escrow— durante uno o dos años', 'en garantía (escrow) durante uno o dos años',
    'al futuro —vesting nuevo, paquetes de retención, a veces un earnout dirigido al equipo—.', 'al futuro: vesting nuevo, paquetes de retención, a veces un earnout dirigido al equipo.',
    'por separado —las sinergias esperadas y el equipo ya armado y funcionando—.', 'por separado: las sinergias esperadas y el equipo ya armado y funcionando.',
    'https://yt3.googleusercontent.com/btm1_PK-7VRUr9GY2D0UV_2XfbUZPBjghyptjSO1crsfN86HyTYDWPmUbq7JxC3H0Lxe_s067nA=s900-c-k-c0x00ffffff-no-rj', 'https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg',
    'Logo de NVIDIA: el ojo estilizado en verde sobre fondo blanco.', 'Logotipo de NVIDIA.'
  ];
  i int;
begin
  for i in 1 .. array_length(cambios, 1) by 2 loop

    update public.laminas l set
      cuerpo = replace(l.cuerpo::text, cambios[i], cambios[i + 1])::jsonb,
      datos  = replace(l.datos::text,  cambios[i], cambios[i + 1])::jsonb
      from public.clases c
     where c.id = l.clase_id and c.slug = 'nvidia-hugging-face';

    update public.preguntas p set
      enunciado = replace(p.enunciado, cambios[i], cambios[i + 1]),
      nota      = replace(p.nota,      cambios[i], cambios[i + 1]),
      datos     = replace(p.datos::text, cambios[i], cambios[i + 1])::jsonb
      from public.clases c
     where c.id = p.clase_id and c.slug = 'nvidia-hugging-face';

  end loop;
end $$;

-- El rótulo fuera, y el pie de la portada con él.
update public.laminas l set etiqueta = null
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face';

update public.laminas l set datos = l.datos - 'pie'
  from public.clases c
 where c.id = l.clase_id and c.slug = 'nvidia-hugging-face' and l.orden = 1;
