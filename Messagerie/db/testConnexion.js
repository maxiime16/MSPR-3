const { Pool } = require('pg');

// Configuration de la connexion à la base de données
const pool = new Pool({
  user: 'admin',
  host: 'localhost', // Utilisez le nom du service du conteneur Docker
  database: 'arosaje',
  password: 'admin',
  port: '5432', // Par défaut, le port de PostgreSQL est 5432
});

// Fonction pour tester la connexion à la base de données
async function testConnection() {
  try {
    // Tentez de vous connecter à la base de données
    const client = await pool.connect();
    console.log('Connexion à la base de données réussie !');

    // Exemple de requête SQL de test
    const result = await client.query('SELECT NOW() AS current_time');
    console.log('Résultat de la requête:', result.rows[0].current_time);

    // Libérez le client de la piscine
    client.release();
  } catch (error) {
    console.error('Erreur lors de la connexion à la base de données :', error);
  } finally {
    // Fermez la piscine de connexion, c'est une bonne pratique
    await pool.end();
  }
}

// Appelez la fonction pour tester la connexion à la base de données
testConnection();
