# Micro-service D'authentification MSPR

## Base de données:
Base de données **PostgreSQL**.
Table utilisée: **Users**

```sql
-- Table Users
CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    password TEXT
);
```


## Informations
`http://localhost:3001/`

## Liste des routes:
- localhost:3001/api/user -> createUser | getAll
- localhost:3001/api/user/:id -> getUserById | deleteUser | updateUser
- localhost:3001/api/user/login -> loginUser
- localhost:3001/api/jwt/verifyToken -> verifyToken

## Format des données (JSONAPI)

```json
{
  "data": {
    "type": "user",
    "attributes": {
      "first_name": "Maxime",
      "last_name": "Devillepoix",
      "email": "maxime.devillepoix@gmail.com",
      "password": "Azerty123"
    }
  }
}
```

```json
{
  "data": {
    "message": "Utilisateur créé avec succès."
  }
}
```