const express = require("express");
const sub_categoryRoute = require("../../routes/subCategories/get.subCategory");
const request = require("supertest");

// Créer un mock pour la base de données
const mockDB = {
  all: jest.fn(),
  get: jest.fn(),
  run: jest.fn(),
};

// Correction de la définition de mockCategory comme un tableau
const mockSub_category = [
  {
    id: 1,
    name: "Arbres",
    category_id: 1,
  },
];

// Création de l'app
const app = express();
app.use(express.json());
app.use("/api/sub_category", sub_categoryRoute(mockDB));

describe("Test pour récupérer toutes les catégories", () => {
  it("Test de la réussite de la récupération code 200", async () => {
    mockDB.all.mockImplementation((query, callback) => {
      callback(null, mockSub_category);
    });

    const response = await request(app).get("/api/sub_category");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockSub_category);
  });

  it("Devrait renvoyer une erreur 500 si une erreur survient lors de la récupération des utilisateurs", async () => {
    // Mock de la réponse de la base de données pour cet ensemble de tests
    mockDB.all.mockImplementation((query, callback) => {
      callback("Erreur lors de la récupération des sous-catégories.");
    });

    const response = await request(app).get("/api/sub_category");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Erreur lors de la récupération des sous-catégories.",
    });
  });
});
describe("Test pour récupérer toutes les catégories", () => {
  it("Le test va retourner un code 200", async ()=>{
    mockDB.get.mockImplementation((query,params, callback) => {
      callback(null, mockSub_category[0]);
    });

    const response = await request(app).get("/api/sub_category/:id");

    console.log(response.body)

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockSub_category[0]);
  });
  it("Le test va retourner un code 200", async ()=>{
    mockDB.get.mockImplementation((query,params, callback) => {
      callback(null, mockSub_category[404]);
    });

    const response = await request(app).get("/api/sub_category/:id");

    console.log(response.body)

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({error : "Erreur lors de la récupération de l'utilisateur avec l'ID."})
    console.log(mockSub_category)
  });
  it("Le test va retourner un code 200", async ()=>{
    mockDB.get.mockImplementation((query,params, callback) => {
      callback(new Error("Erreur lors de la récupération des données"));
    });

    const response = await request(app).get("/api/sub_category/:id");

    console.log(response.body)

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({error : "Erreur lors de la récupération des données"})
  });
});