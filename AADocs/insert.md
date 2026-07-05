# Modelo de insert

INSERT INTO sucesos_suceso (
titulo,
slug,
categoria_id,
descripcion_corta,
descripcion_larga,
latitud,
longitud,
localidad,
provincia,
comunidad_autonoma,
fecha_suceso,
imagen_principal,
audio_url,
video_url,
nivel_misterio,
relevancia,
meta_title,
meta_description,
estado,
created_at,
updated_at
) VALUES (
'El Barranco de Badajoz',
'el-barranco-de-badajoz',
6,
'Este barranco de Tenerife acumula décadas de testimonios sobre luces extrañas,
desapariciones, figuras humanoides y supuestos avistamientos OVNI.',
'El Barranco de Badajoz, situado en el municipio de Güímar, en la isla de Tenerife,
es considerado uno de los lugares con mayor concentración de fenómenos anómalos de
España. Desde mediados del siglo XX, vecinos, senderistas e investigadores han
recogido numerosos testimonios relacionados con luces de origen desconocido,
esferas luminosas que parecen desplazarse entre las montañas, figuras humanoides
de gran estatura e incluso supuestas desapariciones temporales. Uno de los casos
más conocidos ocurrió en la década de 1970, cuando varios excursionistas afirmaron
observar una intensa luz descendiendo sobre el barranco antes de desaparecer
sin dejar rastro. Desde entonces se han sucedido decenas de relatos similares.

Además del fenómeno OVNI, el lugar ha sido relacionado con experiencias difíciles 
de explicar. Algunos visitantes aseguran haber perdido la noción del tiempo 
durante varios minutos u horas, mientras que otros describen una sensación de 
silencio absoluto, cambios repentinos de temperatura o la impresión de estar 
siendo observados. También existen testimonios sobre figuras vestidas de blanco 
que aparecen brevemente entre la vegetación antes de desvanecerse sin dejar rastro.

El barranco posee además un importante valor arqueológico e histórico. 
En sus cuevas se conservan restos vinculados a los antiguos guanches, los 
primeros habitantes de Tenerife, lo que ha favorecido el nacimiento de 
numerosas teorías que relacionan el enclave con antiguos lugares sagrados. 
Algunos investigadores consideran que esta carga histórica, unida a la 
espectacular geografía del barranco, ha contribuido a alimentar las leyendas 
modernas.

A pesar de la enorme cantidad de testimonios, ninguna investigación ha conseguido demostrar el origen de los supuestos fenómenos. Las explicaciones propuestas van desde errores de percepción, reflejos atmosféricos o sugestión hasta hipótesis relacionadas con actividad geológica o fenómenos aún no comprendidos. Sin embargo, el Barranco de Badajoz continúa siendo uno de los escenarios más emblemáticos de la ufología española y un lugar de peregrinación para investigadores del misterio procedentes de todo el mundo.',
28.307900,
-16.393300,
'Güímar',
'Santa Cruz de Tenerife',
'Canarias',
NULL,
NULL,
NULL,
NULL,
5,
10,
'El Barranco de Badajoz | Atlas del Misterio',
'Descubre el Barranco de Badajoz, uno de los lugares con mayor número de testimonios sobre OVNIs, luces extrañas y fenómenos inexplicables de España.',
'PUBLICADO',
NOW(),
NOW()
);
