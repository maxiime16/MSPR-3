const request = require("supertest");
const app = require("../server");
const http = require("http");

let server;

beforeAll((done) => {
  // Démarrer l'application sur un port différent pour les tests
  server = http.createServer(app);
  server.listen(3011, done);
});

afterAll((done) => {
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
    const res = await request(app).get("/unknown-route");
    expect(res.status).toBe(404);
    expect(res.text).toBe("Page not found");
  });

  it("should handle bad JSON error", async () => {
    const res = await request(app)
      .post("/api/advertisement")
      .send("invalid json")
      .set("Content-Type", "application/json");
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Bad JSON" });
  });

  it("should handle global errors", async () => {
    const res = await request(app).get("/error");
    expect(res.status).toBe(500);
    expect(res.text).toBe("Internal Server Error");
  });

  // Test des routes spécifiques
  it("should return 200 for the advertisement route", async () => {
    const res = await request(app).get("/api/advertisement");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the advice route", async () => {
    const res = await request(app).get("/api/advice");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the category route", async () => {
    const res = await request(app).get("/api/category");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the subcategory route", async () => {
    const res = await request(app).get("/api/subcategory");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the image route", async () => {
    const res = await request(app).get("/api/image");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the plant route", async () => {
    const res = await request(app).get("/api/plant");
    expect(res.status).toBe(200);
  });

  it("should return 200 for the address route", async () => {
    const res = await request(app).get("/api/address");
    expect(res.status).toBe(200);
  });
});
