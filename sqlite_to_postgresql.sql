CREATE TABLE IF NOT EXISTS Users (
id INTEGER NOT NULL ,
first_name TEXT NOT NULL ,
last_name TEXT NOT NULL ,
email TEXT NOT NULL ,
password TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS Category (
id INTEGER NOT NULL ,
name TEXT NOT NULL 
);

CREATE TABLE IF NOT EXISTS Sub_category (
id INTEGER NOT NULL ,
name TEXT NOT NULL ,
category_id INTEGER NOT NULL ,
FOREIGN KEY (category_id) REFERENCES Category (id)
);

CREATE TABLE IF NOT EXISTS Advice (
id INTEGER NOT NULL ,
advertisement_id INTEGER NOT NULL ,
user_id INTEGER NOT NULL ,
advice TEXT NOT NULL ,
FOREIGN KEY (user_id) REFERENCES Users (id),
FOREIGN KEY (advertisement_id) REFERENCES Advertisements (id)
);

CREATE TABLE IF NOT EXISTS Advertisements (
id INTEGER NOT NULL ,
description TEXT NOT NULL ,
user_id INTEGER NOT NULL ,
latitude DECIMAL NOT NULL ,
category_id INTEGER NOT NULL ,
sub_category_id INTEGER NOT NULL ,
start_date DATE NOT NULL ,
end_date DATE NOT NULL ,
longitude DECIMAL NOT NULL ,
city VARCHAR(255) NOT NULL ,
postal_code INT NOT NULL ,
title VARCHAR(255) NOT NULL ,
FOREIGN KEY (sub_category_id) REFERENCES Sub_Category (id),
FOREIGN KEY (category_id) REFERENCES Category (id),
FOREIGN KEY (user_id) REFERENCES Users (id)
);

CREATE TABLE IF NOT EXISTS images (
id INTEGER NOT NULL ,
advertisement_id INTEGER NOT NULL ,
image TEXT NOT NULL ,
FOREIGN KEY (advertisement_id) REFERENCES Advertisements (id)
);

CREATE TABLE IF NOT EXISTS users (
id INTEGER NOT NULL ,
first_name TEXT NOT NULL ,
last_name TEXT NOT NULL ,
email TEXT NOT NULL ,
password TEXT NOT NULL 
);

