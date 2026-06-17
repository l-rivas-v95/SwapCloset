-- SwapCloset - Seed limpio
-- Password de todos los usuarios: swap123
-- Imagenes: Cloudinary (cloud: dgucb1e4a)

BEGIN;

TRUNCATE TABLE
    producto_historico,
    mensaje,
    chat,
    seguidor,
    favorito,
    imagen_producto,
    raiting,
    producto,
    usuario
RESTART IDENTITY CASCADE;

-- USUARIOS
INSERT INTO usuario (nombre, apellidos, email, password, descripcion, estilo, url_img, direccion, t_camiseta, t_pantalon, t_calzado) VALUES
('Luis',   'Martinez', 'luis@swapcloset.com',   '$2b$10$vCQgQE.1.141zCpL5udOz.5X4fIfQLUR0o9ValOjmPasyGdDb5CVu', 'Amante de la moda casual y los intercambios.', 'Casual',    'https://res.cloudinary.com/dgucb1e4a/image/upload/img-perfil_v4ccaa',  'Calle Mayor 12, Madrid',         'M', 42, 43),
('Sara',   'Gonzalez', 'sara@swapcloset.com',   '$2b$10$5C3br7mG3TyLw89uIjmnIu4N2CoCNT7BfMKSU8GpiYmwSxxiUmGfS', 'Me encanta la moda formal y los vestidos.',     'Formal',    'https://res.cloudinary.com/dgucb1e4a/image/upload/img-perfil-3_ot5per', 'Avenida de la Paz 5, Barcelona', 'S', 38, 37),
('Carlos', 'Ruiz',     'carlos@swapcloset.com', '$2b$10$F2z6FhLecS90mWqzig8A7.x5LBwH0lYYrEaE5McAFdVeWtd9vr5HS', 'Estilo deportivo, mucho Nike y Adidas.',        'Deportivo', 'https://res.cloudinary.com/dgucb1e4a/image/upload/img-perfil-2_dw2egb', 'Paseo del Prado 3, Madrid',      'L', 44, 44),
('Marta',  'Lopez',    'marta@swapcloset.com',  '$2b$10$JxGbDtv/GVzuKh/bKTLJMu.8Ensy0oJtC5Fe5Xsm0dLNeps3N1Ooq', 'Fan de Zara y Mango. Renuevo armario a menudo.','Casual',    'https://res.cloudinary.com/dgucb1e4a/image/upload/img-perfil_v4ccaa',  'Gran Via 18, Bilbao',            'S', 36, 38),
('Javier', 'Sanchez',  'javier@swapcloset.com', '$2b$10$NlppXjucBUtD5DQ8PITWuOzjv8cMV5/f/hmIbVVyClpDX9ezto5US', 'Coleccionista de chaquetas.',                   'Informal',  'https://res.cloudinary.com/dgucb1e4a/image/upload/img-perfil-2_dw2egb', 'Calle Serrano 44, Madrid',       'L', 42, 42);

-- PRODUCTOS
INSERT INTO producto (tipo, precio, titulo, estilo, descripcion, marca, estado, categoria, talla, color, activo, id_usuario) VALUES
('intercambio', NULL,  'Camisa estampada',   'Casual',    'Camisa de manga corta estampada, perfecta para verano. Usada pocas veces.', 'Nike',      'Bueno',      'Ropa',       'M',  'Multicolor', true, 1),
('prestamo',    25.00, 'Chupa de cuero',     'Informal',  'Chaqueta de cuero genuino, estilo biker. En perfecto estado.',              'Levis',     'Como nuevo', 'Ropa',       'M',  'Negro',      true, 1),
('intercambio', NULL,  'Vestido verde',      'Formal',    'Vestido midi de color verde esmeralda, ideal para eventos. Talla S.',       'Mango',     'Como nuevo', 'Ropa',       'S',  'Verde',      true, 2),
('intercambio', NULL,  'Pantalones azules',  'Casual',    'Pantalones vaqueros de corte recto, clasico y versatil. Muy poco uso.',     'Levis',     'Bueno',      'Ropa',       'S',  'Azul',       true, 2),
('intercambio', NULL,  'Zapatillas Nike',    'Deportivo', 'Nike Air Force 1 blancas, talla 44. En muy buen estado.',                   'Nike',      'Bueno',      'Calzado',    '44', 'Blanco',     true, 3),
('prestamo',    10.00, 'Sudadera negra',     'Deportivo', 'Sudadera con capucha de algodon grueso. Muy comoda para entrenar.',         'Nike',      'Bueno',      'Ropa',       'L',  'Negro',      true, 3),
('prestamo',    15.00, 'Chaqueta marron',    'Casual',    'Chaqueta entallada color camel, perfecta para primavera.',                  'Zara',      'Como nuevo', 'Ropa',       'S',  'Marron',     true, 4),
('intercambio', NULL,  'Falda midi plisada', 'Formal',    'Falda midi de pliegues color negro, elegante y facil de combinar.',         'H&M',       'Nuevo',      'Ropa',       'S',  'Negro',      true, 4),
('intercambio', NULL,  'Chaqueta verde',     'Informal',  'Chaqueta verde militar de tela resistente, estilo cargo.',                  'Pull&Bear', 'Bueno',      'Ropa',       'L',  'Verde',      true, 5),
('intercambio', NULL,  'Gorra azul',         'Deportivo', 'Gorra azul marino ajustable, bordado frontal. Nunca usada.',               'Nike',      'Nuevo',      'Accesorios', 'U',  'Azul',       true, 5);

-- IMAGENES DE PRODUCTO
INSERT INTO imagen_producto (url_img, orden, id_producto) VALUES
('https://res.cloudinary.com/dgucb1e4a/image/upload/camisa_jzr0ui',      1, 1),
('https://res.cloudinary.com/dgucb1e4a/image/upload/chupa-cuero_qai0pj', 1, 2),
('https://res.cloudinary.com/dgucb1e4a/image/upload/vestido-verde_yvex93', 1, 3),
('https://res.cloudinary.com/dgucb1e4a/image/upload/pantalones-azules_kb9cuz', 1, 4),
('https://res.cloudinary.com/dgucb1e4a/image/upload/zapatos-nike_jovv2i', 1, 5),
('https://res.cloudinary.com/dgucb1e4a/image/upload/sudadera-negra_y8rk2v', 1, 6),
('https://res.cloudinary.com/dgucb1e4a/image/upload/chaqueta-marron_xpgzkm', 1, 7),
('https://res.cloudinary.com/dgucb1e4a/image/upload/41p3AEqv7DL._AC_SY580_-2872398340_kg5uxb', 1, 8),
('https://res.cloudinary.com/dgucb1e4a/image/upload/chaqueta-verde_uxdywf', 1, 9),
('https://res.cloudinary.com/dgucb1e4a/image/upload/51helrDdfzL._AC_SY580_-2926793799_oxy67i', 1, 10);

-- RATINGS
INSERT INTO raiting (id_puntuado, id_puntuador, puntuacion) VALUES
(1, 2, 5),
(1, 3, 4),
(2, 1, 5),
(2, 4, 4),
(3, 1, 4),
(3, 2, 5),
(4, 3, 3),
(4, 5, 5),
(5, 1, 4),
(5, 2, 4);

-- FAVORITOS
INSERT INTO favorito (id_usuario, id_producto) VALUES
(1, 3),
(1, 5),
(2, 1),
(2, 9),
(3, 2),
(3, 7),
(4, 3),
(4, 5),
(5, 1),
(5, 6);

-- SEGUIDORES
INSERT INTO seguidor (id_seguidor, id_seguido) VALUES
(1, 2),
(1, 3),
(2, 1),
(2, 4),
(3, 1),
(3, 5),
(4, 2),
(4, 3),
(5, 1),
(5, 4);

-- CHATS
INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, ubicacion, estado, confirmado1, confirmado2, completado, activo) VALUES
(1, 2, 3, 'Gran Via, Madrid', 'pendiente', false, false, false, true);

INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, id_producto2, ubicacion, fecha_quedada, estado, confirmado1, confirmado2, completado, activo) VALUES
(3, 1, 1, 5, 'Plaza Mayor, Madrid', '2026-07-15 18:00:00', 'aceptado', true, true, true, true);

INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, estado, confirmado1, confirmado2, completado, activo) VALUES
(4, 3, 5, 'pendiente', false, false, false, true);

INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, fecha_quedada, fecha_devolucion, ubicacion, estado, confirmado1, confirmado2, completado, activo) VALUES
(2, 4, 7, '2026-06-20 17:00:00', '2026-07-20 17:00:00', 'Paseo de Gracia, Barcelona', 'pendiente', false, false, false, true);

-- MENSAJES - Chat 1 (Luis y Sara)
INSERT INTO mensaje (id_chat, contenido, id_remitente, tipo, leido) VALUES
(1, 'Hola! Me encanta el vestido verde, esta disponible para intercambio?', 1, 'TEXTO', true),
(1, 'Hola Luis! Si, esta disponible. Que tendrias para intercambiar?',      2, 'TEXTO', true),
(1, 'Tengo una camisa estampada en perfectas condiciones, talla M.',        1, 'TEXTO', true),
(1, 'Mandame fotos y si hay acuerdo quedamos.',                             2, 'TEXTO', true),
(1, '2026-07-10T18:00:00',                                                  1, 'FECHA', false),
(1, 'Calle Gran Via 1, Madrid',                                             1, 'UBICACION', false);

-- MENSAJES - Chat 2 (Carlos y Luis, completado)
INSERT INTO mensaje (id_chat, contenido, id_remitente, tipo, aceptado, leido) VALUES
(2, 'Hola! Me interesa tu camisa. Yo tengo zapatillas Nike 44 para intercambiar.', 3, 'TEXTO',           NULL, true),
(2, 'Perfecto, me interesan las zapatillas. Propón fecha y lugar.',                 1, 'TEXTO',           NULL, true),
(2, '2026-07-15T18:00:00',                                                          3, 'FECHA',           true, true),
(2, 'Plaza Mayor, Madrid',                                                          3, 'UBICACION',       true, true),
(2, '2026-07-22T18:00:00',                                                          3, 'FECHA_DEVOLUCION',true, true),
(2, '5',                                                                            1, 'PRODUCTO',        true, true),
(2, 'Carlos ha confirmado el intercambio. Confirma tu tambien!',                    3, 'TEXTO',           NULL, true),
(2, 'Luis ha confirmado el intercambio. Confirma tu tambien!',                      1, 'TEXTO',           NULL, true);

-- MENSAJES - Chat 3 (Marta y Carlos)
INSERT INTO mensaje (id_chat, contenido, id_remitente, tipo, leido) VALUES
(3, 'Hola Carlos! Esas zapatillas me encantan. Las cambias por algo?',         4, 'TEXTO', true),
(3, 'Hola Marta! Cuentame que tienes, soy bastante selectivo con el calzado.', 3, 'TEXTO', false);

-- MENSAJES - Chat 4 (Sara y Marta)
INSERT INTO mensaje (id_chat, contenido, id_remitente, tipo, aceptado, leido) VALUES
(4, 'Hola Marta! Me encanta tu chaqueta marron. La alquilaria para una boda.',  2, 'TEXTO',           NULL, true),
(4, 'Claro! Es perfecta para eventos. Cuando la necesitarias?',                 4, 'TEXTO',           NULL, true),
(4, 'Para el 20 de junio. Podria ser?',                                         2, 'TEXTO',           NULL, true),
(4, '2026-06-20T17:00:00',                                                      2, 'FECHA',           false, true),
(4, 'Paseo de Gracia, Barcelona',                                               2, 'UBICACION',       false, false),
(4, '2026-07-20T17:00:00',                                                      2, 'FECHA_DEVOLUCION',false, false);

COMMIT;
