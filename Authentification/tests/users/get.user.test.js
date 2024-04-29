const request = require("supertest");
const express = require("express");
const usersRoute = require("../../routes/users/get.user");
const port = 3000;



const db = {
  get: jest.fn(),
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
  {
    id: 3,
    first_name: "Enzo",
    last_name: "De Sousa",
    email: "enzo@example.com2",
    password: "password123",
  },
];

const app = express();
app.use(express.json());
app.use("/api/users", usersRoute(db));

describe("Test de récupération des utilisateurs par id", () => {
  it("Le test va retourner un code 500.", async () => {
    db.get.mockImplementation((query, params, callback) => {
      callback(
        new Error(
          "Une erreur s'est produite lors de la recherche de l'utilisateur."
        )
      );
    });
    const response = await request(app).get("/api/users/:id");

    expect(response.status).toBe(500);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({
      error: "Une erreur s'est produite lors de la recherche de l'utilisateur.",
    });
  });

  it("Le test va retourner un code 200.", async () => {
    db.get.mockImplementation((query, params, callback) => {
      callback(null,mockUsers[1]);
    });
    const response = await request(app).get("/api/users/:id");

    expect(response.status).toBe(200);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual(mockUsers[1]);
    console.log(response.body);
  });
  it("Le test va retourner un code 400.", async () => {
    db.get.mockImplementation((query, params, callback) => {
      callback(mockUsers[999]);
    });
    const response = await request(app).get("/api/users/:id");

    expect(response.status).toBe(404);
    expect(response.type).toMatch(/json/);
    expect(response.body).toEqual({error :"Aucun utilisateur trouvé avec cet ID."});
    console.log(response.body);
  });
});

describe("Test du login de connexions", () =>{
    it("Le test va retourner un code 200", async () =>{
        db.get.mockImplementation((params,query,callback) =>{
            callback(mockUsers[1]);
        })
        const response = await (await request(app).get("api/users/login").send(mockUsers[1]))

        expect(response.status).toBe(200)
        expect(response.type).toMatch(/json/)
        expect(response.body).toEqual(mockUsers[1])
        expect(response.headers.authorization).toBeDefined();
    })
    it("Le test va retourner un code 500", async () =>{
        db.get.mockImplementation((params,query,callback) =>{
            callback(new Error("Une erreur s'est produite lors de la recherche de l'utilisateur."));
        })
        const response = await (await request(app).get("api/users/login").send(mockUsers[1]))

        expect(response.status).toBe(500)
        expect(response.type).toMatch(/json/)
        expect(response.body).toEqual(mockUsers[1])
        expect(response.headers.authorization).toBeDefined();
    })
    it("Le test va retourner un code 200", async () =>{
        db.get.mockImplementation((params,query,callback) =>{
            callback(mockUsers[1]);
        })
        const response = await (await request(app).get("api/users/login").send(mockUsers[1]))

        expect(response.status).toBe(200)
        expect(response.type).toMatch(/json/)
        expect(response.body).toEqual(mockUsers[1])
        expect(response.headers.authorization).toBeDefined();
    })
})