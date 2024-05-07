const request = require("supertest");
const app = require("../server");
const CategoryModel = require("../models/categoryModel");

jest.mock("../models/categoryModel");

describe("Category Controller", () => {
  describe("GET /api/category", () => {
    it("should return all categories", async () => {
      const categories = [{ id: 1, name: "Category 1" }, { id: 2, name: "Category 2" }];
      CategoryModel.getAll.mockResolvedValue(categories);

      const response = await request(app).get("/api/category");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: categories.map((category) => ({
          type: "category",
          id: category.id,
          attributes: {
            name: category.name,
          },
        })),
      });
    });

    it("should handle server error", async () => {
      CategoryModel.getAll.mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/api/category");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ errors: [{ message: "Server Error" }] });
    });
  });

  describe("GET /api/category/:id", () => {
    it("should return category by id", async () => {
      const category = { id: 1, name: "Category 1" };
      CategoryModel.getById.mockResolvedValue(category);

      const response = await request(app).get("/api/category/1");

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        data: {
          type: "category",
          id: category.id,
          attributes: {
            name: category.name,
          },
        },
      });
    });

    it("should handle category not found", async () => {
      CategoryModel.getById.mockResolvedValue(null);

      const response = await request(app).get("/api/category/100");

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ errors: [{ message: "Category not found" }] });
    });

    it("should handle server error", async () => {
      CategoryModel.getById.mockRejectedValue(new Error("Database Error"));

      const response = await request(app).get("/api/category/1");

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ errors: [{ message: "Server Error" }] });
    });
  });
});
