const request = require("supertest");
const express = require("express");
const usersRoute = require("../../routes/users/create.user");

const app = express();
app.use(express.json());

// Mock de la base de données (vous pouvez utiliser un outil comme jest-mock ou sinon stub/mock la méthode `get` et `run` de db)
const db = {
  all: jest.fn(),
  run: jest.fn(),
};

const mockUsers = [
  {
    id: 1,
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    password: "password123",
  },
  {
    id: 2,
    first_name: "John2",
    last_name: "Doe2",
    email: "john.doe@example.com2",
    password: "password123",
  },
];

// Utilisez votre routeur avec la base de données mockée
app.use("/api/users", usersRoute(db));

describe("POST /signup", () => {
   
   /////////////
   // Code 200//
   /////////////

  it("devrait créer un nouvel utilisateur avec succès code 201", async () => {
    const newUser = {
      first_name: "Joh",
      last_name: "Do",
      email: "joh.do@example.com",
      password: "password123",
    };

    // Simule une recherche de l'utilisateur qui n'existe pas déjà
    db.all.mockImplementation((query, params, callback) => {
      callback(null, null);
    });

    // Simule l'insertion réussie de l'utilisateur
    db.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const res = await request(app).post("/api/users/signup").send(newUser);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("message", "Utilisateur créé avec succès.");
  });

  /////////////
  // Code 400//
  /////////////

  it(`devrait ne pas créer d'utilisateur 400`, async () => {
    const newUser = {
      first_name: "John2",
      last_name: "Doe2",
      email: "john.doe@example.com2",
      password: "password123",
    };

    // Simule une recherche de l'utilisateur qui n'existe pas déjà
    db.all.mockImplementationOnce((query, params, callback) => {
      callback(mockUsers, null);
    });

    // Simule l'insertion réussie de l'utilisateur
    db.run.mockImplementation((query, params, callback) => {
      callback(null);
    });

    const res = await request(app).post("/api/users/signup").send(newUser);

    expect(res.statusCode).toBe(400);
    expect(res.body).toEqual({ error:  "Cette email est déjà utilisé."});
  });

   /////////////
   // Code 500//
   /////////////

  it(`devrait ne pas créer d'utilisateur 500`, async () => {
    const newUser = {
      first_name: "Enzo",
      last_name: "Enzo",
      email: "enzo@example.com",
      password: "password123",
    };

    // Simule une recherche de l'utilisateur qui n'existe pas déjà
    db.all.mockImplementationOnce((query, params, callback) => {
      callback(null);
    });

    // Simule l'insertion réussie de l'utilisateur
    db.run.mockImplementation((query, params, callback) => {
      callback(new Error("Une erreur s'est produite lors de la création de l'utilisateur."));
    });

    const res = await request(app).post("/api/users/signup").send(newUser);

    expect(res.statusCode).toBe(500);
    expect(res.body).toEqual({ error:  "Une erreur s'est produite lors de la création de l'utilisateur."});
  });

  // Ajoutez d'autres tests pour les cas d'erreur, par exemple, si l'utilisateur existe déjà
});

//http://localhost:3000/api/users/signup
