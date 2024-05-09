const request = require('supertest');
const app = require('../server');
const UserModel = require('../models/userModel');

describe('User Controller', () => {
  describe('GET /api/user', () => {
    it('should return all users with status code 200', async () => {
      // Mock la fonction getAll du modèle pour retourner des données simulées
      const mockUsers = [
        { id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
        { id: 2, first_name: 'Jane', last_name: 'Doe', email: 'jane@example.com' }
      ];
      jest.spyOn(UserModel, 'getAll').mockResolvedValue(mockUsers);

      const response = await request(app).get('/api/user');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveLength(2); // Vérifie si deux utilisateurs sont renvoyés
      expect(response.body.data[0].attributes.first_name).toBe('John'); // Vérifie le premier utilisateur
    });

    it('should handle server errors and return status code 500', async () => {
      // Mock la fonction getAll du modèle pour retourner une erreur
      jest.spyOn(UserModel, 'getAll').mockRejectedValue(new Error('Database error'));

      const response = await request(app).get('/api/user');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('errors');
    });
  });

});
