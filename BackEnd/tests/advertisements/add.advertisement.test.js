const express = require("express");
const advertisementsRoute = require("../../routes/advertisements/add.advertisement");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  run: jest.fn(),

};

//Création de l'app
const app = express();
app.use(express.json());
app.use("/api/advertisements", advertisementsRoute(mockDB));

describe("Test de la route pour créer une annonce", () => {
    it("Devrait renvoyer un message de création avec succès", async () => {
      const createdAdvertissement = {
        title: "Nouvelle Annonce De Test",
        description: "Voici la description de la nouvelle annonce",
        user_id: 1,
        longitude: 1.234,
        latitude: 2.345,
        category_id: 1,
        sub_category_id: 1,
      };
  
      mockDB.run.mockImplementation((query, params, callback) => {
        callback(null);
      });
  
      const response = await request(app)
        .post("/api/advertisements/create")
        .send(createdAdvertissement);
  
      console.log(response.text);
  
      expect(response.status).toBe(200);
      // Convertir la chaîne JSON en objet JavaScript
      const responseBody = JSON.parse(response.text);
  
      expect(responseBody).toEqual({
        message: "Annonce insérée avec succès.",
      });
    });
      it("Devrait renvoyer un message d'erreur lors de l'insertion", async () => {
        const createdAdvertissement = {
          title: "Nouvelle Annonce De Test",
          description: "Voici la description de la nouvelle annonce",
          user_id: 1,
          longitude: 1.234,
          latitude: 2.345,
          category_id: 1,
          sub_category_id: 1,
        };
    
        mockDB.run.mockImplementation((query, params, callback) => {
          callback(new Error("Erreur simulée lors de l'insertion"));
        });
    
        const response = await request(app)
          .post("/api/advertisements/create")
          .send(createdAdvertissement);
    
        console.log(response.text);
    
        expect(response.status).toBe(500);
    
        // Convertir la chaîne JSON en objet JavaScript
        const responseBody = JSON.parse(response.text);
    
        expect(responseBody).toEqual({
          error: "Erreur lors de l'insertion de l'annonce.",
          details: "Erreur simulée lors de l'insertion"
        });
      });
    });