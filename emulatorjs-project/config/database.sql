CREATE DATABASE minigestor_pokemon;
USE minigestor_pokemon;

CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plataforma (
    id_plataforma INT AUTO_INCREMENT PRIMARY KEY,
    nombre_plataforma VARCHAR(50) NOT NULL UNIQUE
);

CREATE TABLE juego (
    id_juego INT AUTO_INCREMENT PRIMARY KEY,
    nombre_juego VARCHAR(100) NOT NULL,
    id_plataforma INT NOT NULL,

    CONSTRAINT fk_juego_plataforma
        FOREIGN KEY (id_plataforma)
        REFERENCES plataforma(id_plataforma)
);

CREATE TABLE tipo (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tipo VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE naturaleza (
    id_naturaleza INT AUTO_INCREMENT PRIMARY KEY,
    nombre_naturaleza VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE pokemon (
    id_pokemon INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    nivel INT NOT NULL,
    sexo ENUM('M', 'F', 'Desconocido') DEFAULT 'Desconocido',

    id_usuario INT NOT NULL,
    id_juego INT NOT NULL,
    id_naturaleza INT,

    CONSTRAINT fk_pokemon_usuario
        FOREIGN KEY (id_usuario)
        REFERENCES usuario(id_usuario)
        ON DELETE CASCADE,

    CONSTRAINT fk_pokemon_juego
        FOREIGN KEY (id_juego)
        REFERENCES juego(id_juego)
        ON DELETE CASCADE,

    CONSTRAINT fk_pokemon_naturaleza
        FOREIGN KEY (id_naturaleza)
        REFERENCES naturaleza(id_naturaleza)
);

CREATE TABLE pokemon_tipo (
    id_pokemon INT NOT NULL,
    id_tipo INT NOT NULL,

    PRIMARY KEY (id_pokemon, id_tipo),

    CONSTRAINT fk_pt_pokemon
        FOREIGN KEY (id_pokemon)
        REFERENCES pokemon(id_pokemon)
        ON DELETE CASCADE,

    CONSTRAINT fk_pt_tipo
        FOREIGN KEY (id_tipo)
        REFERENCES tipo(id_tipo)
        ON DELETE CASCADE
);

INSERT INTO usuario (nombre_usuario, email, password)
VALUES ('Ash', 'ash@pokemon.com', 'pikachu');