const CategoryModel = require("../models/categoryModel");

exports.getAllCategory = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll();
    const responseData = categories.map((category) => ({
      type: "category",
      id: category.id,
      attributes: {
        name: category.name,
      },
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await CategoryModel.getById(categoryId);
    if (!category) {
      return res.status(404).json({ errors: [{ message: "Category not found" }] });
    }
    const responseData = {
      type: "category",
      id: category.id,
      attributes: {
        name: category.name,
      },
    };
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.createCategory = async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = await CategoryModel.create({
      name,
    });
    res.status(201).json({ data: newCategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  try {
    await CategoryModel.delete(categoryId);
    res.status(204).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { name } = req.body;
  try {
    const updatedCategory = await CategoryModel.update(categoryId, {
      name,
    });
    res.status(200).json({ data: updatedCategory });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
