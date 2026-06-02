CREATE OR REPLACE TABLE usuario (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(20) NOT NULL,
    apellidos VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(30) NOT NULL,
    descripcion VARCHAR(500),
    estilo VARCHAR(30),
    url_img VARCHAR(500),
    direccion VARCHAR(500),
    t_camiseta VARCHAR(4),
    t_pantalon INT,
    t_calzado INT
);

ALTER TABLE usuario
MODIFY nombre VARCHAR(20) NOT NULL,
MODIFY apellidos VARCHAR(50) NOT NULL,
MODIFY email VARCHAR(50) NOT NULL,
MODIFY password VARCHAR(30) NOT NULL

CREATE OR REPLACE TABLE producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tipo ENUM('intercambio','prestamo') NOT NULL,
    precio DECIMAL(10,2),
    titulo VARCHAR(50) NOT NULL,
    estilo VARCHAR(30) NOT NULL,
    descripcion VARCHAR(500),
    marca VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL,
    categoria VARCHAR(20) NOT NULL,
    talla VARCHAR(4) NOT NULL,
    color VARCHAR(20),
    fecha_devolucion DATETIME NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_usuario INT NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    CONSTRAINT fk_producto_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);

ALTER TABLE producto
MODIFY titulo VARCHAR(50) NOT NULL,
MODIFY estilo VARCHAR(30) NOT NULL,
MODIFY marca VARCHAR(20) NOT NULL,
MODIFY estado VARCHAR(20) NOT NULL,
MODIFY categoria VARCHAR(20) NOT NULL,
MODIFY talla VARCHAR(4) NOT NULL

CREATE OR REPLACE TABLE raiting (
    id_puntuado INT NOT NULL,
    id_puntuador INT NOT NULL,
    puntuacion INT CHECK (puntuacion BETWEEN 1 AND 5),
    PRIMARY KEY (id_puntuado, id_puntuador),
    CONSTRAINT fk_raiting_puntuado
        FOREIGN KEY (id_puntuado)
        REFERENCES usuario(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_raiting_puntuador
        FOREIGN KEY (id_puntuador)
        REFERENCES usuario(id)
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE imagen_producto (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url_img VARCHAR(500) NOT NULL,
    orden INT DEFAULT 1,
    id_producto INT NOT NULL,
    CONSTRAINT fk_imagen_producto_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto (id)
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE favorito (
    id_usuario INT NOT NULL,
    id_producto INT NOT NULL,
    PRIMARY KEY (id_usuario, id_producto),
    CONSTRAINT fk_favorito_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_favorito_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto (id)
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE seguidor (
    id_seguidor INT NOT NULL,   
    id_seguido INT NOT NULL,    
    PRIMARY KEY (id_seguidor, id_seguido),  
    CONSTRAINT fk_seguidores_seguidor
        FOREIGN KEY (id_seguidor) 
        REFERENCES usuario(id)
        ON DELETE CASCADE,   -- El seguidor se elimina si el usuario es eliminado
    
    CONSTRAINT fk_seguidores_seguido
        FOREIGN KEY (id_seguido)
        REFERENCES usuario(id)
        ON DELETE CASCADE    -- El seguido se elimina si el usuario es eliminado
);

CREATE OR REPLACE TABLE chat (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario1 INT NOT NULL,
    id_usuario2 INT NOT NULL,
    id_producto1 INT NOT NULL,
    id_producto2 INT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    fecha_quedada DATETIME NULL,
    fecha_devolucion DATETIME NULL,
    ubicacion VARCHAR(100),
    estado ENUM('pendiente','aceptado','devuelto') DEFAULT 'pendiente',
    completado BOOLEAN DEFAULT false,
    CONSTRAINT fk_chat_usuario1
        FOREIGN KEY (id_usuario1)
        REFERENCES usuario (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat_usuario2
        FOREIGN KEY (id_usuario2)
        REFERENCES usuario (id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat_producto1 
        FOREIGN KEY (id_producto1) 
        REFERENCES producto(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_chat_producto2
        FOREIGN KEY (id_producto2)
        REFERENCES producto(id)
        ON DELETE SET NULL
);

ALTER TABLE chat
ADD estado ENUM('pendiente','aceptado','devuelto') DEFAULT 'pendiente'

CREATE OR REPLACE TABLE mensaje (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_chat INT NOT NULL,
    contenido TEXT NOT NULL,
    fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    leido BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_mensaje_chat 
        FOREIGN KEY (id_chat) 
        REFERENCES chat(id)
        ON DELETE CASCADE
);

CREATE OR REPLACE TABLE producto_historico (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto INT NULL,
    id_usuario INT NULL,
    tipo ENUM('intercambio','prestamo') NOT NULL,
    accion ENUM('CREADO','ACTUALIZADO','BORRADO','DESACTIVADO') NOT NULL,
    titulo VARCHAR(50),
    estilo VARCHAR(30),
    descripcion VARCHAR(500),
    marca VARCHAR(20),
    categoria VARCHAR(20),
    talla VARCHAR(4),
    color VARCHAR(20),
    precio DECIMAL(10,2),
    fecha_devolucion DATETIME NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_hist_producto
        FOREIGN KEY (id_producto)
        REFERENCES producto(id)
        ON DELETE SET NULL,
    CONSTRAINT fk_hist_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id)
        ON DELETE SET NULL
);

INSERT INTO usuario (nombre, apellidos, email, password, descripcion, estilo, url_img, direccion, t_camiseta, t_pantalon, t_calzado) VALUES
('Luis', 'Pérez', 'luis@gmail.com', 'pass123', 'Descripción 1', 'Casual', 'assets/img/img-perfil.png', 'Calle 1', 'M', 40, 42),
('Guille', 'Gómez', 'ana@gmail.com', 'pass123', 'Descripción 2', 'Formal', 'assets/img/img-perfil-2.png', 'Calle 2', 'S', 38, 39),
('Carlos', 'López', 'carlos@gmail.com', 'pass123', 'Descripción 3', 'Deportivo', 'assets/img/img-perfil-3.png', 'Calle 3', 'L', 42, 44),
('Marta', 'Ramírez', 'marta@gmail.com', 'pass123', 'Descripción 4', 'Casual', 'url4.jpg', 'Calle 4', 'M', 40, 41),
('Javier', 'Torres', 'javier@gmail.com', 'pass123', 'Descripción 5', 'Formal', 'url5.jpg', 'Calle 5', 'L', 44, 45),
('Laura', 'Sánchez', 'laura@gmail.com', 'pass123', 'Descripción 6', 'Deportivo', 'url6.jpg', 'Calle 6', 'S', 36, 38),
('Pedro', 'Díaz', 'pedro@gmail.com', 'pass123', 'Descripción 7', 'Casual', 'url7.jpg', 'Calle 7', 'M', 41, 43),
('Elena', 'Muñoz', 'elena@gmail.com', 'pass123', 'Descripción 8', 'Formal', 'url8.jpg', 'Calle 8', 'S', 37, 39),
('Andrés', 'Cruz', 'andres@gmail.com', 'pass123', 'Descripción 9', 'Deportivo', 'url9.jpg', 'Calle 9', 'L', 43, 44),
('Sofía', 'Vargas', 'sofia@gmail.com', 'pass123', 'Descripción 10', 'Casual', 'url10.jpg', 'Calle 10', 'M', 40, 42);

INSERT INTO producto (tipo, precio, titulo, estilo, descripcion, marca, estado, categoria, talla, color, id_usuario) VALUES
('intercambio', null, 'Camiseta Roja', 'Casual', 'Camiseta de algodón', 'Nike', 'Nuevo', 'Ropa', 'M', 'Rojo', 1),
('prestamo', 15.00, 'Pantalón Azul', 'Formal', 'Pantalón de tela', 'Adidas', 'Usado', 'Ropa', 'L', 'Azul', 2),
('intercambio', null, 'Zapatillas', 'Deportivo', 'Zapatillas cómodas', 'Puma', 'Nuevo', 'Calzado', '42', 'Blanco', 3),
('prestamo', 12.50, 'Chaqueta', 'Casual', 'Chaqueta ligera', 'Reebok', 'Nuevo', 'Ropa', 'M', 'Negro', 4),
('intercambio', null, 'Camisa', 'Formal', 'Camisa elegante', 'H&M', 'Usado', 'Ropa', 'L', 'Blanco', 5),
('prestamo', 8.50, 'Sudadera', 'Deportivo', 'Sudadera cómoda', 'Nike', 'Nuevo', 'Ropa', 'S', 'Gris', 6),
('intercambio', null, 'Falda', 'Casual', 'Falda corta', 'Zara', 'Nuevo', 'Ropa', 'M', 'Negro', 7),
('prestamo', 30.00, 'Vestido', 'Formal', 'Vestido elegante', 'Mango', 'Nuevo', 'Ropa', 'S', 'Rojo', 8),
('intercambio', null, 'Gorra', 'Deportivo', 'Gorra de béisbol', 'Nike', 'Usado', 'Accesorios', 'S', 'Azul', 9),
('prestamo', 22.00, 'Chaqueta de cuero', 'Casual', 'Chaqueta elegante', 'Levis', 'Nuevo', 'Ropa', 'L', 'Marrón', 10);


INSERT INTO raiting (id_puntuado, id_puntuador, puntuacion) VALUES
(1,2,5),
(1,3,4),
(2,1,3),
(2,3,4),
(3,1,5),
(3,2,4),
(4,1,3),
(4,2,5),
(5,1,4),
(5,2,5);

INSERT INTO imagen_producto (url_img, orden, id_producto) VALUES
('img1.jpg', 1, 1),
('img2.jpg', 2, 1),
('img3.jpg', 1, 2),
('img4.jpg', 2, 2),
('img5.jpg', 1, 3),
('img6.jpg', 1, 4),
('img7.jpg', 1, 5),
('img8.jpg', 1, 6),
('img9.jpg', 1, 7),
('img10.jpg', 1, 8);

INSERT INTO favorito (id_usuario, id_producto) VALUES
(1,3),
(1,4),
(2,1),
(2,5),
(3,2),
(3,6),
(4,3),
(4,7),
(5,1),
(5,8);


INSERT INTO seguidor (id_seguidor, id_seguido) VALUES
(1,2),
(1,3),
(2,1),
(2,3),
(3,1),
(3,4),
(4,1),
(4,5),
(5,2),
(5,3);

INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, id_producto2, ubicacion) VALUES
(1,2,1,2,'Calle 1'),
(2,3,2,null,'Calle 2'),
(3,4,3,4,'Calle 3'),
(4,5,4,null,'Calle 4'),
(5,1,5,1,'Calle 5'),
(1,3,1,null,'Calle 6'),
(2,4,2,4,'Calle 7'),
(3,5,3,null,'Calle 8'),
(4,1,4,1,'Calle 9'),
(5,2,5,null,'Calle 10');


INSERT INTO mensaje (id_chat, contenido) VALUES
(1,'Hola, me interesa tu producto'),
(1,'Perfecto, ¿cuándo lo recoges?'),
(2,'Hola, ¿aún disponible?'),
(2,'Sí, podemos quedar mañana'),
(3,'Interesado en la prenda'),
(3,'Ok, nos vemos hoy'),
(4,'Me gusta, lo quiero'),
(4,'Genial, lo preparo'),
(5,'Disponibilidad de entrega'),
(5,'Sí, mañana'),
(6,'Consulta sobre talla'),
(6,'Está disponible'),
(7,'Confirmo recogida'),
(7,'Gracias'),
(8,'Pregunta sobre color'),
(8,'Envío fotos'),
(9,'Cuándo puedo pasar'),
(9,'Hoy por la tarde'),
(10,'Precio negociable?'),
(10,'Sí, podemos acordar');


INSERT INTO producto_historico (id_producto, id_usuario, tipo, accion, titulo, estilo, descripcion, marca, categoria, talla, color, precio) VALUES
(1,1,'intercambio','CREADO','Camiseta Roja','Casual','Camiseta de algodón','Nike','Ropa','M','Rojo',10.50),
(2,2,'prestamo','CREADO','Pantalón Azul','Formal','Pantalón de tela','Adidas','Ropa','L','Azul',15.00),
(3,3,'intercambio','CREADO','Zapatillas','Deportivo','Zapatillas cómodas','Puma','Calzado','42','Blanco',20.00),
(4,4,'prestamo','CREADO','Chaqueta','Casual','Chaqueta ligera','Reebok','Ropa','M','Negro',12.50),
(5,5,'intercambio','CREADO','Camisa','Formal','Camisa elegante','H&M','Ropa','L','Blanco',18.00),
(6,6,'prestamo','CREADO','Sudadera','Deportivo','Sudadera cómoda','Nike','Ropa','S','Gris',8.50),
(7,7,'intercambio','CREADO','Falda','Casual','Falda corta','Zara','Ropa','M','Negro',25.00),
(8,8,'prestamo','CREADO','Vestido','Formal','Vestido elegante','Mango','Ropa','S','Rojo',30.00),
(9,9,'intercambio','CREADO','Gorra','Deportivo','Gorra de béisbol','Nike','Accesorios','S','Azul',5.00),
(10,10,'prestamo','CREADO','Chaqueta de cuero','Casual','Chaqueta elegante','Levis','Ropa','L','Marrón',22.00);




INSERT INTO usuario (nombre, apellidos, email, password, descripcion, estilo, url_img, direccion, t_camiseta, t_pantalon, t_calzado) VALUES
('Luis', 'Pérez', 'luis@gmail.com', 'pass123', 'Descripción 1', 'Casual', 'assets/img/img-perfil.png', 'Calle 1', 'M', 40, 42),
('Guille', 'Gómez', 'ana@gmail.com', 'pass123', 'Descripción 2', 'Formal', 'assets/img/img-perfil-2.png', 'Calle 2', 'S', 38, 39),
('Carlos', 'López', 'carlos@gmail.com', 'pass123', 'Descripción 3', 'Deportivo', 'assets/img/img-perfil-3.png', 'Calle 3', 'L', 42, 44),
('Marta', 'Ramírez', 'marta@gmail.com', 'pass123', 'Descripción 4', 'Casual', 'url4.jpg', 'Calle 4', 'M', 40, 41),
('Javier', 'Torres', 'javier@gmail.com', 'pass123', 'Descripción 5', 'Formal', 'url5.jpg', 'Calle 5', 'L', 44, 45),
('Laura', 'Sánchez', 'laura@gmail.com', 'pass123', 'Descripción 6', 'Deportivo', 'url6.jpg', 'Calle 6', 'S', 36, 38),
('Pedro', 'Díaz', 'pedro@gmail.com', 'pass123', 'Descripción 7', 'Casual', 'url7.jpg', 'Calle 7', 'M', 41, 43),
('Elena', 'Muñoz', 'elena@gmail.com', 'pass123', 'Descripción 8', 'Formal', 'url8.jpg', 'Calle 8', 'S', 37, 39),
('Andrés', 'Cruz', 'andres@gmail.com', 'pass123', 'Descripción 9', 'Deportivo', 'url9.jpg', 'Calle 9', 'L', 43, 44),
('Sofía', 'Vargas', 'sofia@gmail.com', 'pass123', 'Descripción 10', 'Casual', 'url10.jpg', 'Calle 10', 'M', 40, 42);

INSERT INTO producto (tipo, precio, titulo, estilo, descripcion, marca, estado, categoria, talla, color, id_usuario) VALUES
('intercambio', null, 'Camiseta Roja', 'Casual', 'Camiseta de algodón', 'Nike', 'Nuevo', 'Ropa', 'M', 'Rojo', 1),
('prestamo', 15.00, 'Pantalón Azul', 'Formal', 'Pantalón de tela', 'Adidas', 'Usado', 'Ropa', 'L', 'Azul', 2),
('intercambio', null, 'Zapatillas', 'Deportivo', 'Zapatillas cómodas', 'Puma', 'Nuevo', 'Calzado', '42', 'Blanco', 3),
('prestamo', 12.50, 'Chaqueta', 'Casual', 'Chaqueta ligera', 'Reebok', 'Nuevo', 'Ropa', 'M', 'Negro', 4),
('intercambio', null, 'Camisa', 'Formal', 'Camisa elegante', 'H&M', 'Usado', 'Ropa', 'L', 'Blanco', 5),
('prestamo', 8.50, 'Sudadera', 'Deportivo', 'Sudadera cómoda', 'Nike', 'Nuevo', 'Ropa', 'S', 'Gris', 6),
('intercambio', null, 'Falda', 'Casual', 'Falda corta', 'Zara', 'Nuevo', 'Ropa', 'M', 'Negro', 7),
('prestamo', 30.00, 'Vestido', 'Formal', 'Vestido elegante', 'Mango', 'Nuevo', 'Ropa', 'S', 'Rojo', 8),
('intercambio', null, 'Gorra', 'Deportivo', 'Gorra de béisbol', 'Nike', 'Usado', 'Accesorios', 'S', 'Azul', 9),
('prestamo', 22.00, 'Chaqueta de cuero', 'Casual', 'Chaqueta elegante', 'Levis', 'Nuevo', 'Ropa', 'L', 'Marrón', 10);


INSERT INTO raiting (id_puntuado, id_puntuador, puntuacion) VALUES
(1,2,5),
(1,3,4),
(2,1,3),
(2,3,4),
(3,1,5),
(3,2,4),
(4,1,3),
(4,2,5),
(5,1,4),
(5,2,5);

INSERT INTO imagen_producto (url_img, orden, id_producto) VALUES
('img1.jpg', 1, 1),
('img2.jpg', 2, 1),
('img3.jpg', 1, 2),
('img4.jpg', 2, 2),
('img5.jpg', 1, 3),
('img6.jpg', 1, 4),
('img7.jpg', 1, 5),
('img8.jpg', 1, 6),
('img9.jpg', 1, 7),
('img10.jpg', 1, 8);

INSERT INTO favorito (id_usuario, id_producto) VALUES
(1,3),
(1,4),
(2,1),
(2,5),
(3,2),
(3,6),
(4,3),
(4,7),
(5,1),
(5,8);


INSERT INTO seguidor (id_seguidor, id_seguido) VALUES
(1,2),
(1,3),
(2,1),
(2,3),
(3,1),
(3,4),
(4,1),
(4,5),
(5,2),
(5,3);

INSERT INTO chat (id_usuario1, id_usuario2, id_producto1, id_producto2, ubicacion) VALUES
(1,2,1,2,'Calle 1'),
(2,3,2,null,'Calle 2'),
(3,4,3,4,'Calle 3'),
(4,5,4,null,'Calle 4'),
(5,1,5,1,'Calle 5'),
(1,3,1,null,'Calle 6'),
(2,4,2,4,'Calle 7'),
(3,5,3,null,'Calle 8'),
(4,1,4,1,'Calle 9'),
(5,2,5,null,'Calle 10');


INSERT INTO mensaje (id_chat, contenido) VALUES
(1,'Hola, me interesa tu producto'),
(1,'Perfecto, ¿cuándo lo recoges?'),
(2,'Hola, ¿aún disponible?'),
(2,'Sí, podemos quedar mañana'),
(3,'Interesado en la prenda'),
(3,'Ok, nos vemos hoy'),
(4,'Me gusta, lo quiero'),
(4,'Genial, lo preparo'),
(5,'Disponibilidad de entrega'),
(5,'Sí, mañana'),
(6,'Consulta sobre talla'),
(6,'Está disponible'),
(7,'Confirmo recogida'),
(7,'Gracias'),
(8,'Pregunta sobre color'),
(8,'Envío fotos'),
(9,'Cuándo puedo pasar'),
(9,'Hoy por la tarde'),
(10,'Precio negociable?'),
(10,'Sí, podemos acordar');


INSERT INTO producto_historico (id_producto, id_usuario, tipo, accion, titulo, estilo, descripcion, marca, categoria, talla, color, precio) VALUES
(1,1,'intercambio','CREADO','Camiseta Roja','Casual','Camiseta de algodón','Nike','Ropa','M','Rojo',10.50),
(2,2,'prestamo','CREADO','Pantalón Azul','Formal','Pantalón de tela','Adidas','Ropa','L','Azul',15.00),
(3,3,'intercambio','CREADO','Zapatillas','Deportivo','Zapatillas cómodas','Puma','Calzado','42','Blanco',20.00),
(4,4,'prestamo','CREADO','Chaqueta','Casual','Chaqueta ligera','Reebok','Ropa','M','Negro',12.50),
(5,5,'intercambio','CREADO','Camisa','Formal','Camisa elegante','H&M','Ropa','L','Blanco',18.00),
(6,6,'prestamo','CREADO','Sudadera','Deportivo','Sudadera cómoda','Nike','Ropa','S','Gris',8.50),
(7,7,'intercambio','CREADO','Falda','Casual','Falda corta','Zara','Ropa','M','Negro',25.00),
(8,8,'prestamo','CREADO','Vestido','Formal','Vestido elegante','Mango','Ropa','S','Rojo',30.00),
(9,9,'intercambio','CREADO','Gorra','Deportivo','Gorra de béisbol','Nike','Accesorios','S','Azul',5.00),
(10,10,'prestamo','CREADO','Chaqueta de cuero','Casual','Chaqueta elegante','Levis','Ropa','L','Marrón',22.00);

