-- ----- Authentification --------
CREATE TABLE Users(
	id              SERIAL NOT NULL ,
	first_name      VARCHAR (50) NOT NULL ,
	last_name       VARCHAR (50) NOT NULL ,
	email           VARCHAR (50) NOT NULL ,
	password        VARCHAR (150) NOT NULL ,
	creation_date   DATE  NOT NULL  DEFAULT CURRENT_DATE,
	CONSTRAINT User_PK PRIMARY KEY (id)
)WITHOUT OIDS;

-- ----- Messagerie --------
CREATE TABLE Conversation(
    id                SERIAL NOT NULL,
    title             VARCHAR(50) NOT NULL,
    user1_id          INT NOT NULL,
    user2_id          INT NOT NULL,
    CONSTRAINT Conversation_PK PRIMARY KEY (id),
    CONSTRAINT Conversation_User1_FK FOREIGN KEY (user1_id) REFERENCES Users(id),
    CONSTRAINT Conversation_User2_FK FOREIGN KEY (user2_id) REFERENCES Users(id)
) WITHOUT OIDS;

CREATE TABLE Message(
    id                  SERIAL NOT NULL,
    message             VARCHAR(255) NOT NULL,
    send_date           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sender_id           INT NOT NULL,
    recipient_id        INT NOT NULL,
    conversation_id     INT NOT NULL,
    CONSTRAINT Message_PK PRIMARY KEY (id),
    CONSTRAINT Message_Sender_FK FOREIGN KEY (sender_id) REFERENCES Users(id),
    CONSTRAINT Message_Recipient_FK FOREIGN KEY (recipient_id) REFERENCES Users(id),
    CONSTRAINT Message_Conversation_FK FOREIGN KEY (conversation_id) REFERENCES Conversation(id)
) WITHOUT OIDS;


-- ----- BackEnd --------
CREATE TABLE  category(
	id     SERIAL NOT NULL ,
	name   VARCHAR (50) NOT NULL  ,
	CONSTRAINT category_PK PRIMARY KEY (id)
)WITHOUT OIDS;

CREATE TABLE  Sub_category(
	id            SERIAL NOT NULL ,
	name          VARCHAR (50) NOT NULL ,
	id_category   INT  NOT NULL  ,
	CONSTRAINT Sub_category_PK PRIMARY KEY (id),
	CONSTRAINT Sub_category_category_FK FOREIGN KEY (id_category) REFERENCES  Category(id)
)WITHOUT OIDS;

CREATE TABLE  Address(
	id            SERIAL NOT NULL ,
	City          VARCHAR (50) NOT NULL ,
	Postal_code   INT  NOT NULL ,
	Longitude     FLOAT  NOT NULL ,
	Latitude      FLOAT  NOT NULL  ,
	CONSTRAINT Address_PK PRIMARY KEY (id)
)WITHOUT OIDS;

CREATE TABLE  Advertisement(
	id              SERIAL NOT NULL ,
	Title           VARCHAR (50) NOT NULL ,
	start_date      DATE  NOT NULL ,
	end_date        DATE  NOT NULL ,
	creation_date   DATE  NOT NULL DEFAULT CURRENT_DATE,
	id_Address      INT  NOT NULL ,
	id_User         INT  NOT NULL  ,
	CONSTRAINT Advertisement_PK PRIMARY KEY (id),
	CONSTRAINT Advertisement_Address_FK FOREIGN KEY (id_Address) REFERENCES  Address(id),
	CONSTRAINT Advertisement_User0_FK FOREIGN KEY (id_User) REFERENCES  Users(id)
)WITHOUT OIDS;

CREATE TABLE  Plant(
	id                 SERIAL NOT NULL ,
	Name_plant         VARCHAR (50) NOT NULL ,
	Description        VARCHAR (50) NOT NULL ,
	id_Advertisement   INT  NOT NULL ,
	id_Sub_category    INT  NOT NULL  ,
	CONSTRAINT Plant_PK PRIMARY KEY (id),
	CONSTRAINT Plant_Advertisement_FK FOREIGN KEY (id_Advertisement) REFERENCES  Advertisement(id),
	CONSTRAINT Plant_Sub_category0_FK FOREIGN KEY (id_Sub_category) REFERENCES  Sub_category(id)
)WITHOUT OIDS;

CREATE TABLE  Image(
	id         SERIAL NOT NULL ,
	image      BYTEA  NOT NULL ,
	id_Plant   INT  NOT NULL  ,
	CONSTRAINT Image_PK PRIMARY KEY (id),
	CONSTRAINT Image_Plant_FK FOREIGN KEY (id_Plant) REFERENCES  Plant(id)
)WITHOUT OIDS;

CREATE TABLE  Advice(
	id              SERIAL NOT NULL ,
	Content         VARCHAR (50) NOT NULL ,
	Creation_date   DATE  NOT NULL DEFAULT CURRENT_DATE,
	id_Plant        INT  NOT NULL ,
	id_User         INT  NOT NULL  ,
	CONSTRAINT Advice_PK PRIMARY KEY (id),
	CONSTRAINT Advice_Plant_FK FOREIGN KEY (id_Plant) REFERENCES  Plant(id),
	CONSTRAINT Advice_User0_FK FOREIGN KEY (id_User) REFERENCES  Users(id)
)WITHOUT OIDS;

-- ----- Données --------
-- Insertion des catégories
INSERT INTO Category (name) VALUES ('Arbres');
INSERT INTO Category (name) VALUES ('Fleurs');
INSERT INTO Category (name) VALUES ('Arbustes');
INSERT INTO Category (name) VALUES ('Plantes grimpantes');

-- Insertion des sous-catégories pour chaque catégorie
-- Sous-catégories pour 'Arbres'
INSERT INTO Sub_category (name, id_category) VALUES ('Chêne', 1);
INSERT INTO Sub_category (name, id_category) VALUES ('Érable', 1);

-- Sous-catégories pour 'Fleurs'
INSERT INTO Sub_category (name, id_category) VALUES ('Rose', 2);
INSERT INTO Sub_category (name, id_category) VALUES ('Tulipe', 2);

-- Sous-catégories pour 'Arbustes'
INSERT INTO Sub_category (name, id_category) VALUES ('Buis', 3);
INSERT INTO Sub_category (name, id_category) VALUES ('Hortensia', 3);

-- Sous-catégories pour 'Plantes grimpantes'
INSERT INTO Sub_category (name, id_category) VALUES ('Lierre', 4);
INSERT INTO Sub_category (name, id_category) VALUES ('Glycine', 4);
