const request = require("supertest");
const express = require("express");
const usersRoute = require("../../routes/users/delete.user");

const db = {
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

const app = express();
app.use(express.json());
app.use("/api/users", usersRoute(db));

describe("Test de suppression de compte par id", () => {
  it("Le test renvoie un code 500", async () => {
    db.run.mockImplementation((query, param, callback) => {
      callback(
        new Error(
          "Une erreur s'est produite lors de la suppression du compte utilisateur."
        )
      );
      //callback(null, mockUsers[1]);
    });
    const response = await request(app).delete("/api/users/1");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error:
        "Une erreur s'est produite lors de la suppression du compte utilisateur.",
    });
  });
});


describe("Test de suppression de compte par id", () => {
  it("Le test renvoie un code 200", async () => {
    db.run.mockImplementation((query, param, callback) => {
      //callback(new Error ("Une erreur s'est produite lors de la suppression du compte utilisateur."));
      callback(null, mockUsers[1]);
    });
    const response = await request(app).delete("/api/users/1");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({message: "Compte utilisateur supprimé avec succès."});
  });
});
