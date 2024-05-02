CREATE TABLE Utilisateurs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_utilisateur VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(100),
    date_creation DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nom_conversation VARCHAR(100)
);

CREATE TABLE Participants_Conversation (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_conversation INT,
    id_utilisateur INT,
    FOREIGN KEY (id_conversation) REFERENCES Conversations(id),
    FOREIGN KEY (id_utilisateur) REFERENCES Utilisateurs(id)
);

CREATE TABLE Messages (
    id INT PRIMARY KEY AUTO_INCREMENT,
    id_conversation INT,
    id_expéditeur INT,
    contenu TEXT,
    date_envoi DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_conversation) REFERENCES Conversations(id),
    FOREIGN KEY (id_expéditeur) REFERENCES Utilisateurs(id)
);
