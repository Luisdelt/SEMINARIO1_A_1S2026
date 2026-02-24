CREATE DATABASE IF NOT EXISTS catalogo_cine
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE catalogo_cine;

-- Tabla: Usuario
CREATE TABLE IF NOT EXISTS Usuario (
    id_usuario      INT             NOT NULL AUTO_INCREMENT,
    correo          VARCHAR(255)    NOT NULL UNIQUE,
    nombre_completo VARCHAR(150)    NOT NULL,
    contrasena      CHAR(32)        NOT NULL,
    foto_perfil     VARCHAR(500)    NULL,
    fecha_registro  DATETIME        NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario)
) ENGINE=InnoDB;

-- Tabla: Pelicula
CREATE TABLE IF NOT EXISTS Pelicula (
    id_pelicula     INT             NOT NULL AUTO_INCREMENT,
    titulo          VARCHAR(255)    NOT NULL,
    director        VARCHAR(150)    NOT NULL,
    anio_estreno    YEAR            NOT NULL,
    poster          VARCHAR(500)    NULL,
    url_contenido   VARCHAR(500)    NOT NULL,
    estado          ENUM(
                        'Disponible',
                        'Proximo_Estreno'
                    )               NOT NULL  DEFAULT 'Disponible',
    PRIMARY KEY (id_pelicula)
) ENGINE=InnoDB;

-- Tabla: Lista_Reproduccion
CREATE TABLE IF NOT EXISTS Lista_Reproduccion (
    id_lista        INT             NOT NULL AUTO_INCREMENT,
    id_usuario      INT             NOT NULL,
    id_pelicula     INT             NOT NULL,
    fecha_agregado  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_lista),
    UNIQUE KEY uq_usuario_pelicula (id_usuario, id_pelicula),
    CONSTRAINT fk_lista_usuario
        FOREIGN KEY (id_usuario)  REFERENCES Usuario (id_usuario)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_lista_pelicula
        FOREIGN KEY (id_pelicula) REFERENCES Pelicula (id_pelicula)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;
