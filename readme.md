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
- Avoir docker ouvert
- 1er build: Commande à la racine du projet: `docker-compose up -d`
- Rebuild: `docker-compose up --build -d backend authservice messagerieservice`

### Accès pgAdmin
- démarrer les conteneurs
- aller a l'url `http://localhost:5050`
- email: `admin@admin.com` | password: `admin`
