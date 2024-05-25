-- ----- Authentification --------
CREATE TABLE Users (
    UserId SERIAL PRIMARY KEY,
    FirstName VARCHAR(50),
    LastName VARCHAR(50),
    Email VARCHAR(100),
    Password VARCHAR(100)
);

-- ----- Messagerie --------
CREATE TABLE Conversation (
    ConversationId SERIAL PRIMARY KEY,
    Title VARCHAR(100),
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

CREATE TABLE Message (
    MessageId SERIAL PRIMARY KEY,
    Message TEXT,
    SendDate DATE,
    ConversationId INT,
    UserId INT,
    FOREIGN KEY (ConversationId) REFERENCES Conversation(ConversationId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- ----- BackEnd --------
CREATE TABLE Address (
    AddressId SERIAL PRIMARY KEY,
    City VARCHAR(100),
    Postal_Code INT,
    Longitude FLOAT,
    Latitude FLOAT
);

CREATE TABLE Advertisement (
    AdvertisementId SERIAL PRIMARY KEY,
    Title VARCHAR(100),
    StartDate DATE,
    EndDate DATE,
    UserId INT,
    AddressId INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (AddressId) REFERENCES Address(AddressId)
);

CREATE TABLE Category (
    CategoryId SERIAL PRIMARY KEY,
    Name VARCHAR(100)
);

CREATE TABLE SubCategory (
    SubCategoryId SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    CategoryId INT,
    FOREIGN KEY (CategoryId) REFERENCES Category(CategoryId)
);

CREATE TABLE Plant (
    PlantId SERIAL PRIMARY KEY,
    Name_Plant VARCHAR(100),
    Description TEXT,
    AdvertisementId INT,
    SubCategoryId INT,
    FOREIGN KEY (AdvertisementId) REFERENCES Advertisement(AdvertisementId),
    FOREIGN KEY (SubCategoryId) REFERENCES SubCategory(SubCategoryId)
);

CREATE TABLE Image (
    ImageId SERIAL PRIMARY KEY,
    Image BYTEA,
    PlantId INT,
    FOREIGN KEY (PlantId) REFERENCES Plant(PlantId)
);

CREATE TABLE Advice (
    AdviceId SERIAL PRIMARY KEY,
    Content TEXT,
    CreationDate DATE DEFAULT CURRENT_DATE,
    UserId INT,
    PlantId INT,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (PlantId) REFERENCES Plant(PlantId)
);


-- ----- Données --------
-- Insertion des catégories
INSERT INTO Category (Name) VALUES ('Arbres');
INSERT INTO Category (Name) VALUES ('Fleurs');
INSERT INTO Category (Name) VALUES ('Arbustes');
INSERT INTO Category (Name) VALUES ('Plantes grimpantes');

-- Insertion des sous-catégories pour chaque catégorie
-- Sous-catégories pour 'Arbres'
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Chêne', 1);
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Érable', 1);

-- Sous-catégories pour 'Fleurs'
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Rose', 2);
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Tulipe', 2);

-- Sous-catégories pour 'Arbustes'
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Buis', 3);
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Hortensia', 3);

-- Sous-catégories pour 'Plantes grimpantes'
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Lierre', 4);
INSERT INTO SubCategory (Name, CategoryId) VALUES ('Glycine', 4);
