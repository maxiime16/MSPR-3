   ---------------------
--⏐ CREATION DES TABLES ⏐
   ---------------------


-- Table Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
);

-- Table Category
CREATE TABLE Category (
    id SERIAL PRIMARY KEY,
    name TEXT
);

-- Table Sub_category
CREATE TABLE Sub_category (
    id SERIAL PRIMARY KEY,
    name TEXT,
    category_id INTEGER,
    FOREIGN KEY (category_id) REFERENCES Category(id)
);

-- Table Advertisements
CREATE TABLE Advertisements (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    longitude NUMERIC,
    latitude NUMERIC,
    user_id INTEGER,
    category_id INTEGER,
    sub_category_id INTEGER,
    FOREIGN KEY (user_id) REFERENCES Users(id),
    FOREIGN KEY (category_id) REFERENCES Category(id),
    FOREIGN KEY (sub_category_id) REFERENCES Sub_category(id)
);

-- Table Images
CREATE TABLE Images (
    id SERIAL PRIMARY KEY,
    id_advertisement INTEGER,
    image BYTEA,
    FOREIGN KEY (id_advertisement) REFERENCES Advertisements(id)
);

-- Table Advice
CREATE TABLE Advice (
    id SERIAL PRIMARY KEY,
    advertisement_id INTEGER,
    user_id INTEGER,
    advice TEXT,
    FOREIGN KEY (advertisement_id) REFERENCES Advertisements(id),
    FOREIGN KEY (user_id) REFERENCES Users(id)
);

-- Table conversations
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table participants
CREATE TABLE participants (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    conversation_id INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    UNIQUE (user_id, conversation_id)
);

-- Table messages
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id),
    FOREIGN KEY (sender_id) REFERENCES users(id)
);
