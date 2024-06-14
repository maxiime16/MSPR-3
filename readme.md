# MSPR 3
🔴 🟠 🟡 🟢

### Objectifs
- 🟠 ajouter un système de messagerie
- 🟡 basculement sur un SGBD Postgres
- 🟡 mise en place d'une documentation Swagger

### Livrable obligatoire
- 🔴 Diagramme UML de la base de données
- 🟢 Schéma d’architecture de l’application et des différents tiers back-end
- 🔴 Une démonstration de l'applicatif

### Lancer les conteneurs
Vérifier avant dans les dossier BackEnd, Authentification et Messagerie que ```DB_HOST=postgres_db``` dans le .env
Vérifier également que ```DB_DATABASE``` ait la bonne base de donnée
- `docker-compose up -d`
- `docker-compose up --build -d`

### Accès pgAdmin + mise en place de la base de donnée
- Démarrer les conteneurs
- Aller a l'url `http://localhost:5050`
- email: **admin@admin.com** | password: **admin**
- Servers -> Nouveau -> serveur
- Nom: MSPR (ou test) | Nom d'hôte: **postgres** | Port: **5432** | Nom d'utilisateur: **admin** | Mot de passe: **admin**

### Lancer les serveurs depuis VSCode
Vérifier avant dans les dossiers BackEnd, Authentification et Messagerie que ```DB_HOST=localhost``` dans le .env 
- Démarrer uniquement les conteneurs **postgres_db** et **pgadmin**
- Commande pour les serveurs back-end et microservice: ```npm start````
- Commande pour le front-end: ```npx expo start````

### Infos sur l'application
- Ports utilisés:
    - 3000 -> BackEnd
    - 3001 -> Authentification
    - 3002 -> Messagerie
    - 5432 -> postgres

- Doc Swagger:
    URL: ```http://localhots:PORT/api/doc```