const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");


router.get("/", categoryController.getAllCategory);
router.get("/:id", categoryController.getCategoryById);
router.post("/", categoryController.createCategory);
router.delete("/:id", categoryController.deleteCategory);
router.put("/:id", categoryController.updateCategory);

module.exports = router;
