const CategoryModel = require("../models/categoryModel");
const categorySchema = require("../schemas/categorySchema");

const formatCategory = (category) => ({
  type: "categories",
  id: category.id,
  attributes: {
    name: category.name,
  },
});

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll();
    const responseData = categories.map(formatCategory);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching categories: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getCategoryById = async (req, res) => {
  const categoryId = req.params.id;
  if (!categoryId) {
    return res.status(400).json({ errors: [{ message: "Missing category ID" }] });
  }
  try {
    const category = await CategoryModel.getById(categoryId);
    res.status(200).json({ data: formatCategory(category) });
  } catch (err) {
    console.error(`Error fetching category by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createCategory = async (req, res) => {
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { name } = req.body;

  try {
    const newCategory = await CategoryModel.create({ name });
    res.status(201).json({ data: formatCategory(newCategory) });
  } catch (err) {
    console.error(`Error creating category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteCategory = async (req, res) => {
  const categoryId = req.params.id;

  if (!categoryId) {
    return res.status(400).json({ errors: [{ message: "Missing category ID" }] });
  }

  try {
    const deletedCategory = await CategoryModel.delete(categoryId);
    res.status(204).json();
  } catch (err) {
    console.error(`Error deleting category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateCategory = async (req, res) => {
  const categoryId = req.params.id;
  const { error } = categorySchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { name } = req.body;

  if (!categoryId) {
    return res.status(400).json({ errors: [{ message: "Missing category ID" }] });
  }

  try {
    const updatedCategory = await CategoryModel.update(categoryId, { name });

    if (!updatedCategory) {
      return res.status(404).json({ errors: [{ message: "Category not found" }] });
    }

    res.status(200).json({ data: formatCategory(updatedCategory) });
  } catch (err) {
    console.error(`Error updating category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
