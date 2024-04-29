-- Table Users
CREATE TABLE users(
    id INTEGER PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
);

-- Créer les utilisateurs Enzo, Matthieu, Maxime et Alister avec des numéros de rue
INSERT INTO users (first_name, last_name, email, password) 
VALUES 
('Enzo', 'Dupont', 'enzo.dupont@example.com', 'motdepasse_enzo'),
('Matthieu', 'Martin', 'matthieu.martin@example.com', 'motdepasse_matthieu'),
('Maxime', 'Durand', 'maxime.durand@example.com', 'motdepasse_maxime'),
('Alister', 'Lefevre', 'alister.lefevre@example.com', 'motdepasse_alister');