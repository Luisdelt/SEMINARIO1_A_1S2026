USE catalogo_cine;

-- =============================================================
-- SEED: Datos iniciales de prueba
-- Las contraseñas están encriptadas con MD5:
--   contrasena123  -> MD5: 482c811da5d5b4bc6d497ffa98491e38
--   admin2024      -> MD5: f5af4a6d5f2a2f3e4b1c9d8e7a6b5c4d (ilustrativo)
--   cine2024       -> MD5: 9c6a20e4b5f7d3a1e8b2c4f6d9a7e3b1 (ilustrativo)
-- Usar: SELECT MD5('tu_contraseña'); para generar el hash real.
-- =============================================================

-- -------------------------------------------------------------
-- Usuarios de prueba
-- -------------------------------------------------------------
INSERT INTO Usuario (correo, nombre_completo, contrasena, foto_perfil) VALUES
('ana.garcia@mail.com',    'Ana García López',      MD5('contrasena123'), 'fotos_perfil/ana_garcia.jpg'),
('carlos.ruiz@mail.com',   'Carlos Ruiz Méndez',    MD5('contrasena123'), 'fotos_perfil/carlos_ruiz.jpg'),
('maria.lopez@mail.com',   'María López Herrera',   MD5('contrasena123'), 'fotos_perfil/maria_lopez.jpg'),
('pedro.santos@mail.com',  'Pedro Santos Díaz',     MD5('contrasena123'), NULL),
('sofia.morales@mail.com', 'Sofía Morales Castro',  MD5('contrasena123'), 'fotos_perfil/sofia_morales.jpg');

-- -------------------------------------------------------------
-- Catálogo de películas
-- -------------------------------------------------------------
INSERT INTO Pelicula (titulo, director, anio_estreno, poster, url_contenido, estado) VALUES
-- Disponibles
('El Señor de los Anillos: La Comunidad del Anillo', 'Peter Jackson',          2001, 'fotos_publicas/lotr_fellowship.jpg',    'https://www.youtube.com/watch?v=_nZdly461e4', 'Disponible'),
('Inception',                                         'Christopher Nolan',      2010, 'fotos_publicas/inception.jpg',          'https://www.youtube.com/watch?v=YoHD9XEInc0', 'Disponible'),
('Interstellar',                                      'Christopher Nolan',      2014, 'fotos_publicas/interstellar.jpg',       'https://www.youtube.com/watch?v=zSWdZVtXT7E', 'Disponible'),
('Parasite',                                          'Bong Joon-ho',           2019, 'fotos_publicas/parasite.jpg',           'https://www.youtube.com/watch?v=5xH0HfJHsaY', 'Disponible'),
('The Dark Knight',                                   'Christopher Nolan',      2008, 'fotos_publicas/dark_knight.jpg',        'https://www.youtube.com/watch?v=EXeTwQWrcwY', 'Disponible'),
('Avengers: Endgame',                                 'Anthony y Joe Russo',    2019, 'fotos_publicas/endgame.jpg',            'https://www.youtube.com/watch?v=TcMBFSGVi1c', 'Disponible'),
('El León Rey',                                       'Roger Allers',           1994, 'fotos_publicas/lion_king.jpg',          'https://www.youtube.com/watch?v=4sj1MT05lAA', 'Disponible'),
('Intensa-Mente 2',                                   'Kelsey Mann',            2024, 'fotos_publicas/intensamente2.jpg',      'https://www.youtube.com/watch?v=LEjhY15eCx0', 'Disponible'),

-- Próximos estrenos
('Avatar 3',                                          'James Cameron',          2025, 'fotos_publicas/avatar3.jpg',            'https://www.youtube.com/watch?v=placeholder',  'Proximo_Estreno'),
('Jurassic World: La Teoría del Caos',                'Gareth Edwards',         2025, 'fotos_publicas/jurassic_caos.jpg',      'https://www.youtube.com/watch?v=placeholder',  'Proximo_Estreno');

-- -------------------------------------------------------------
-- Listas de reproducción (películas agregadas por usuarios)
-- -------------------------------------------------------------
INSERT INTO Lista_Reproduccion (id_usuario, id_pelicula) VALUES
-- Ana García → 4 películas
(1, 1),  -- LOTR
(1, 2),  -- Inception
(1, 5),  -- The Dark Knight
(1, 7),  -- El León Rey

-- Carlos Ruiz → 3 películas
(2, 2),  -- Inception
(2, 3),  -- Interstellar
(2, 6),  -- Avengers: Endgame

-- María López → 3 películas
(3, 4),  -- Parasite
(3, 8),  -- Intensa-Mente 2
(3, 1),  -- LOTR

-- Pedro Santos → 2 películas
(4, 5),  -- The Dark Knight
(4, 3),  -- Interstellar

-- Sofía Morales → 2 películas
(5, 6),  -- Avengers: Endgame
(5, 7);  -- El León Rey
