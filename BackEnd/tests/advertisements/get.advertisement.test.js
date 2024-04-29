const express = require("express");
const advertisementsRoute = require("../../routes/advertisements/get.advertisement");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
  lastID: 42,
};

//Création des mocks
const mockAdvertissements = [
  {
    id: 0,
    title: "Rose",
    descriptions: "Rose rouge",
    user_id: 1,
    plant_id: 1,
    longitude: 45.123,
    latitude: 2.456,
    category_id: 1,
  },
  {
    id: 1,
    title: "Tulipe",
    descriptions: "Tulipe Blanche",
    user_id: 2,
    plant_id: 2,
    location: "Londre",
    longitude: 45.123,
    latitude: 2.456,
    category_id: 1,
  },
];

//Création de l'app
const app = express();
app.use(express.json());
app.use("/api/advertisements", advertisementsRoute(mockDB));

describe("Test de la route pour récupérer les annonce", () => {
  it("Devrait renvoyer un utilisateur existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockAdvertissements);
    });

    const response = await request(app).get("/api/advertisements");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvertissements);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Une erreur s'est produite lors de la récupération des annonces."
    );
  });
});
describe("Test de la route pour récupérer une annonce ID", () => {
  it("Devrait renvoyer une annonce existente existant au format JSON avec un code d'état 200", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(null, mockAdvertissements[1]);
    });

    const response = await request(app).get("/api/advertisements/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockAdvertissements[1]);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.get.mockImplementation((query, params, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(
      "Une erreur s'est produite lors de la récupération des annonces par id."
    );
  });
});
describe("Test de la route pour récupérer une anonce en fonction de sa category", () => {
  it("Devrait renvoyer une erreur 200 si la récupération a étais faite", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback(null, mockAdvertissements);
    });

    const response = await request(app).get("/api/advertisements/category/3");

    console.log(response.body);

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual([
      mockAdvertissements[0],
      mockAdvertissements[1],
    ]);
  });
  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, params, callback) => {
      callback(
        "Une erreur s'est produite lors de la récupération des annonces."
      );
    });

    const response = await request(app).get("/api/advertisements/category/3");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error:
        "Une erreur s'est produite lors de la récupération des annonces par id.",
    });
  });
});