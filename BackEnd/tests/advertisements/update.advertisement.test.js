const express = require("express");
const advertisementsRoute = require("../../routes/advertisements/update.advertisement");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  run: jest.fn(),
  lastID: 42,
};

//Création de l'app
const app = express();
app.use(express.json());
app.use("/api/advertisements", advertisementsRoute(mockDB));

describe("Test de la route pour mettre à jour une annonce par ID", () => {
  it("Devrait renvoyer un message de succès si la mise à jour est réussie", async () => {
    const updatedAdvertisement = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      user_id: 3,
      plants_id: 4,
      longitude: 1.234,
      latitude: 2.345,
    };

    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.run.mockImplementation((query, params, callback) => {
      callback(null); // Aucune erreur, la mise à jour réussit
    });

    const response = await request(app)
      .put("/api/advertisements/1/update")
      .send(updatedAdvertisement);

    expect(response.status).toBe(200);
    expect(response.text).toContain("mise à jour avec succès");
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la mise à jour", async () => {
    const updatedAdvertisement = {
      title: "Nouveau titre",
      description: "Nouvelle description",
      user_id: 3,
      longitude: 1.234,
      latitude: 2.345,
    };

    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.run.mockImplementation((query, params, callback) => {
      callback("Erreur de base de données"); // Simuler une erreur de base de données
    });

    const response = await request(app)
      .put("/api/advertisements/1/update")
      .send(updatedAdvertisement);

    expect(response.status).toBe(500);
    expect(response.text).toContain("Erreur lors de la mise à jour");
  });
});
