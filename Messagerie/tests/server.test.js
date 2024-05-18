const request = require("supertest");
const app = require("../server"); // Assurez-vous que le chemin est correct
const http = require("http");

let server;

beforeAll(done => {
  // Démarrer l'application sur un port différent pour les tests
  server = http.createServer(app);
  server.listen(3012, done); // Utiliser le port 4000 pour les tests
});

afterAll(done => {
  server.close(done);
});

describe("Server", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    console.error.mockRestore();
  });

  it("should serve Swagger docs on /api/doc", async () => {
    const res = await request(app).get("/api/doc");
    if (res.status === 301 || res.status === 302) {
      const redirectRes = await request(app).get(res.headers.location);
      expect(redirectRes.status).toBe(200);
      expect(redirectRes.text).toContain("Swagger UI");
    } else {
      expect(res.status).toBe(200);
      expect(res.text).toContain("Swagger UI");
    }
  });

  it("should handle 404 errors", async () => {
    const res = await request(app).get("/non-existent-route");
    expect(res.status).toBe(404);
    expect(res.text).toBe("Page not found");
  });

  it("should handle bad JSON error", async () => {
    const res = await request(app)
      .post("/api/conversation") // Vous pouvez changer cette route pour toute route POST valide
      .send("invalid json")
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad JSON" });
  });

  it("should handle global errors", async () => {
    // Mock a route to throw an error
    app.get("/error", (req, res, next) => {
      next(new Error("Test Error"));
    });

    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.text).toBe("Internal Server Error");
  });

  it("should return 200 for /api/conversation", async () => {
    const res = await request(app).get("/api/conversation");
    expect(res.status).toBe(200);
  });

  it("should return 200 for /api/message", async () => {
    const res = await request(app).get("/api/message");
    expect(res.status).toBe(200);
  });

  it("should return 200 for /api/participant", async () => {
    const res = await request(app).get("/api/participant");
    expect(res.status).toBe(200);
  });
});
