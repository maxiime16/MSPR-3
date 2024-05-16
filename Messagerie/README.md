# Microservice de Messagerie

Ce microservice gère la fonctionnalité de messagerie pour l'application. Il offre des opérations CRUD pour les conversations, les messages et les participants.

## URL de base

``` http://localhost:3002/api ```


## Routes

### Conversations

- **GET /conversations**
  - Description : Récupère toutes les conversations
  - Réponse : `200 OK`
  - Format : JSONAPI

- **GET /conversations/:id**
  - Description : Récupère une conversation par son ID
  - Réponse : `200 OK` ou `404 Not Found`
  - Format : JSONAPI

- **POST /conversations**
  - Description : Crée une nouvelle conversation
  - Corps de la requête : Aucun
  - Réponse : `201 Created`
  - Format : JSONAPI

- **DELETE /conversations/:id**
  - Description : Supprime une conversation par son ID
  - Réponse : `204 No Content` ou `404 Not Found`
  - Format : JSONAPI

### Messages

- **GET /messages**
  - Description : Récupère tous les messages
  - Réponse : `200 OK`
  - Format : JSONAPI

- **GET /messages/conversation/:conversation_id**
  - Description : Récupère les messages d'une conversation par l'ID de la conversation
  - Réponse : `200 OK` ou `400 Bad Request`
  - Format : JSONAPI

- **GET /messages/:id**
  - Description : Récupère un message par son ID
  - Réponse : `200 OK` ou `400 Bad Request`
  - Format : JSONAPI

- **POST /messages**
  - Description : Crée un nouveau message
  - Corps de la requête :
    ```json
    {
      "conversation_id": 1,
      "sender_id": 1,
      "content": "Message content"
    }
    ```
  - Réponse : `201 Created` ou `400 Bad Request`
  - Format : JSONAPI

- **DELETE /messages/:id**
  - Description : Supprime un message par son ID
  - Réponse : `204 No Content` ou `404 Not Found`
  - Format : JSONAPI

### Participants

- **GET /participants**
  - Description : Récupère tous les participants
  - Réponse : `200 OK`
  - Format : JSONAPI

- **GET /participants/conversation/:conversation_id**
  - Description : Récupère les participants d'une conversation par l'ID de la conversation
  - Réponse : `200 OK` ou `400 Bad Request`
  - Format : JSONAPI

- **GET /participants/user/:user_id**
  - Description : Récupère les participants d'un utilisateur par l'ID de l'utilisateur
  - Réponse : `200 OK` ou `400 Bad Request`
  - Format : JSONAPI

- **POST /participants**
  - Description : Ajoute un participant à une conversation
  - Corps de la requête :
    ```json
    {
      "user_id": 1,
      "conversation_id": 1
    }
    ```
  - Réponse : `201 Created` ou `400 Bad Request`
  - Format : JSONAPI

- **DELETE /participants/:id**
  - Description : Supprime un participant par son ID
  - Réponse : `204 No Content` ou `404 Not Found`
  - Format : JSONAPI

## Commandes pour lancer les tests

```bash
npm install
npx jest
npx  jest --coverage
```

## Structure de la base de données

### Table `conversations`

| Colonne     | Type      | Description                                  |
|-------------|-----------|----------------------------------------------|
| id          | SERIAL    | Clé primaire                                 |
| created_at  | TIMESTAMP | Horodatage de création par défaut à `NOW()`   |

### Table `participants`

| Colonne           | Type      | Description                                  |
|-------------------|-----------|----------------------------------------------|
| id                | SERIAL    | Clé primaire                                 |
| user_id           | INTEGER   | ID de l'utilisateur                          |
| conversation_id   | INTEGER   | ID de la conversation                        |
| FOREIGN KEY       |           | `user_id` REFERENCES `users(id)`             |
| FOREIGN KEY       |           | `conversation_id` REFERENCES `conversations(id)` |
| UNIQUE            |           | `(user_id, conversation_id)` - Garantit qu'un utilisateur ne peut pas être ajouté deux fois à la même conversation |

### Table `messages`

| Colonne           | Type      | Description                                  |
|-------------------|-----------|----------------------------------------------|
| id                | SERIAL    | Clé primaire                                 |
| conversation_id   | INTEGER   | ID de la conversation                        |
| sender_id         | INTEGER   | ID de l'expéditeur                           |
| content           | TEXT      | Contenu du message                           |
| created_at        | TIMESTAMP | Horodatage de création par défaut à `NOW()`  |
| FOREIGN KEY       |           | `conversation_id` REFERENCES `conversations(id)` |
| FOREIGN KEY       |           | `sender_id` REFERENCES `users(id)`           |
