CREATE DATABASE IF NOT EXISTS BolsaEmpleo;
USE BolsaEmpleo;

-- ─────────────────────────────────────────
-- 1. USUARIO (base común para todos los roles)
-- ─────────────────────────────────────────
CREATE TABLE Usuario (
                         id      INT AUTO_INCREMENT PRIMARY KEY,
                         correo  VARCHAR(100) NOT NULL UNIQUE,   -- login para EMP y OFE
                         clave   VARCHAR(100) NOT NULL,          -- hash BCrypt
                         rol     VARCHAR(5)   NOT NULL,          -- EMP | OFE | ADM
                         activo  BOOLEAN      NOT NULL DEFAULT FALSE
);

-- ─────────────────────────────────────────
-- 2. EMPRESA
-- ─────────────────────────────────────────
CREATE TABLE Empresa (
                         id            INT AUTO_INCREMENT PRIMARY KEY,
                         usuario_id    INT          NOT NULL UNIQUE,
                         nombre        VARCHAR(100) NOT NULL,
                         localizacion  VARCHAR(100),
                         telefono      VARCHAR(20),
                         descripcion   TEXT,
                         CONSTRAINT fk_empresa_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- ─────────────────────────────────────────
-- 3. OFERENTE
-- ─────────────────────────────────────────
CREATE TABLE Oferente (
                          id               INT AUTO_INCREMENT PRIMARY KEY,
                          usuario_id       INT         NOT NULL UNIQUE,
                          identificacion   VARCHAR(20) NOT NULL UNIQUE,
                          nombre           VARCHAR(50) NOT NULL,
                          primer_apellido  VARCHAR(50) NOT NULL,
                          nacionalidad     VARCHAR(50),
                          telefono         VARCHAR(20),
                          residencia       VARCHAR(100),
                          curriculum       VARCHAR(255),          -- ruta del PDF subido
                          CONSTRAINT fk_oferente_usuario FOREIGN KEY (usuario_id) REFERENCES Usuario(id)
);

-- ─────────────────────────────────────────
-- 4. CARACTERISTICA (árbol jerárquico self-ref)
-- ─────────────────────────────────────────
CREATE TABLE Caracteristica (
                                id        INT AUTO_INCREMENT PRIMARY KEY,
                                nombre    VARCHAR(100) NOT NULL,
                                padre_id  INT NULL,                     -- NULL = nodo raíz
                                CONSTRAINT fk_caracteristica_padre FOREIGN KEY (padre_id) REFERENCES Caracteristica(id)
);

-- ─────────────────────────────────────────
-- 5. PUESTO
-- ─────────────────────────────────────────
CREATE TABLE Puesto (
                        id              INT AUTO_INCREMENT PRIMARY KEY,
                        empresa_id      INT            NOT NULL,
                        descripcion     TEXT           NOT NULL,
                        salario         DECIMAL(10,2),
                        tipo            VARCHAR(10)    NOT NULL DEFAULT 'PUBLICO', -- PUBLICO | PRIVADO
                        activo          BOOLEAN        NOT NULL DEFAULT TRUE,
                        fecha_registro  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
                        CONSTRAINT fk_puesto_empresa FOREIGN KEY (empresa_id) REFERENCES Empresa(id)
);

-- ─────────────────────────────────────────
-- 6. PUESTO_CARACTERISTICA (req. de un puesto, N:M)
-- ─────────────────────────────────────────
CREATE TABLE PuestoCaracteristica (
                                      puesto_id         INT NOT NULL,
                                      caracteristica_id INT NOT NULL,
                                      nivel_deseado     INT NOT NULL CHECK (nivel_deseado BETWEEN 1 AND 5),
                                      PRIMARY KEY (puesto_id, caracteristica_id),
                                      CONSTRAINT fk_pc_puesto          FOREIGN KEY (puesto_id)         REFERENCES Puesto(id),
                                      CONSTRAINT fk_pc_caracteristica  FOREIGN KEY (caracteristica_id) REFERENCES Caracteristica(id)
);

-- ─────────────────────────────────────────
-- 7. OFERENTE_HABILIDAD (habilidades del oferente, N:M)
-- ─────────────────────────────────────────
CREATE TABLE OferenteHabilidad (
                                   oferente_id       INT NOT NULL,
                                   caracteristica_id INT NOT NULL,
                                   nivel             INT NOT NULL CHECK (nivel BETWEEN 1 AND 5),
                                   PRIMARY KEY (oferente_id, caracteristica_id),
                                   CONSTRAINT fk_oh_oferente        FOREIGN KEY (oferente_id)       REFERENCES Oferente(id),
                                   CONSTRAINT fk_oh_caracteristica  FOREIGN KEY (caracteristica_id) REFERENCES Caracteristica(id)
);


-- ═════════════════════════════════════════
-- DATOS INICIALES
-- ═════════════════════════════════════════

-- ADM: identificacion=admin | clave=admin123
-- Hash BCrypt de "admin123"
INSERT INTO Usuario (correo, clave, rol, activo)
VALUES ('admin', '$2a$10$a3VQI7FakvZzcVQR9B6vZudQ1Iho9UYKU8xbCwrt0hb1Ic7ivjFV.', 'ADM', TRUE);

-- Características de ejemplo (raíces)
INSERT INTO Caracteristica (nombre, padre_id) VALUES
                                                  ('Bases de Datos',          NULL),
                                                  ('Ciberseguridad',          NULL),
                                                  ('Lenguajes de programación', NULL),
                                                  ('Tecnologías Web',         NULL),
                                                  ('Testing',                 NULL);

-- Hijos de Bases de Datos (id padre = 1)
INSERT INTO Caracteristica (nombre, padre_id) VALUES
                                                  ('MySQL',   1),
                                                  ('Oracle',  1),
                                                  ('MongoDB', 1);

-- Hijos de Lenguajes de programación (id padre = 3)
INSERT INTO Caracteristica (nombre, padre_id) VALUES
                                                  ('C#',     3),
                                                  ('Java',   3),
                                                  ('Kotlin', 3),
                                                  ('Python', 3);

-- Hijos de Tecnologías Web (id padre = 4)
INSERT INTO Caracteristica (nombre, padre_id) VALUES
                                                  ('HTML',       4),
                                                  ('CSS',        4),
                                                  ('JavaScript', 4),
                                                  ('Spring',     4),
                                                  ('Thymeleaf',  4);

-- Hijos de Testing (id padre = 5)
INSERT INTO Caracteristica (nombre, padre_id) VALUES
                                                  ('JUnit',       5),
                                                  ('Assertions',  5),
                                                  ('Test cases',  5);

-- Empresa de prueba (activo=TRUE para poder probar sin esperar aprobación)
-- clave: emp123
INSERT INTO Usuario (correo, clave, rol, activo)
VALUES ('softlab@test.com', '$2a$10$YdCv8oTSsN/vU8gSG5I/vOtf/yCkIXJdYyTenssgi/ULWQAoQsUhK', 'EMP', TRUE);

INSERT INTO Empresa (usuario_id, nombre, localizacion, telefono, descripcion)
VALUES (2, 'SoftLab', 'San José, Costa Rica', '22221111', 'Empresa de desarrollo de software');

-- Oferente de prueba (activo=TRUE)
-- clave: ofe123
INSERT INTO Usuario (correo, clave, rol, activo)
VALUES ('jsanchez@test.com', '$2a$10$DwbzKbY/gztQtORpX47rie/MqUD6/gt5YnIEERx43Q7jtlQIipCH6', 'OFE', TRUE);

INSERT INTO Oferente (usuario_id, identificacion, nombre, primer_apellido, nacionalidad, telefono, residencia)
VALUES (3, '123456', 'Jose', 'Sanchez', 'Costarricense', '88889999', 'San José');

-- Puesto de prueba para SoftLab
INSERT INTO Puesto (empresa_id, descripcion, salario, tipo, activo, fecha_registro)
VALUES (1, 'Full Stack Developer', 2000.00, 'PUBLICO', TRUE, NOW());

INSERT INTO Puesto (empresa_id, descripcion, salario, tipo, activo, fecha_registro)
VALUES (1, 'Frontend Developer', 1200.00, 'PUBLICO', TRUE, NOW() - INTERVAL 1 DAY);

-- Requisitos del puesto 1
INSERT INTO PuestoCaracteristica (puesto_id, caracteristica_id, nivel_deseado)
VALUES
    (1, 10, 4),   -- Java nivel 4
    (1, 13, 3),   -- HTML nivel 3
    (1, 15, 3);   -- JavaScript nivel 3

-- Habilidades del oferente de prueba
INSERT INTO OferenteHabilidad (oferente_id, caracteristica_id, nivel)
VALUES
    (1, 10, 5),   -- Java nivel 5
    (1, 13, 4),   -- HTML nivel 4
    (1, 15, 4);   -- JavaScript nivel 4
