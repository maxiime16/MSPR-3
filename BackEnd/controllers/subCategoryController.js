const SubCategoryModel = require("../models/subCategoryModel");
const subCategorySchema = require("../schemas/subCategorySchema");

const formatSubCategory = (subCategory) => ({
  type: "sub_categories",
  id: subCategory.id,
  attributes: {
    name: subCategory.name,
    category_id: subCategory.id_category,
  },
});

exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategoryModel.getAll();
    const responseData = subCategories.map(formatSubCategory);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching sub-categories: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getSubCategoryById = async (req, res) => {
  const subCategoryId = req.params.id;
  if (!subCategoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing sub-category ID" }] });
  }
  try {
    const subCategory = await SubCategoryModel.getById(subCategoryId);
    if (!subCategory) {
      return res
        .status(404)
        .json({ errors: [{ message: "Sub-category not found" }] });
    }
    res.status(200).json({ data: formatSubCategory(subCategory) });
  } catch (err) {
    console.error(`Error fetching sub-category by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getSubCategoryByCategoryId = async (req, res) => {
  const categoryId = req.params.id_category;
  console.log(categoryId);
  if (!categoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing category ID" }] });
  }
  try {
    const subCategories = await SubCategoryModel.getByCategoryId(categoryId);
    const responseData = subCategories.map(formatSubCategory);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching sub-categories by category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getSubCategoryByCategoryIdAndSubCategoryId = async (req, res) => {
  const categoryId = req.params.id_category;
  const subCategoryId = req.params.id;
  if (!categoryId || !subCategoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing category or sub-category ID" }] });
  }
  try {
    const subCategory = await SubCategoryModel.getByCategoryIdAndSubCategoryId(categoryId, subCategoryId);
    if (!subCategory) {
      return res
        .status(404)
        .json({ errors: [{ message: "Sub-category not found" }] });
    }
    res.status(200).json({ data: formatSubCategory(subCategory) });
  } catch (err) {
    console.error(`Error fetching sub-category by category and sub-category ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createSubCategory = async (req, res) => {
  const { error } = subCategorySchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const { name, id_category } = req.body;

  try {
    const newSubCategory = await SubCategoryModel.create({ name, id_category });
    res.status(201).json({ data: formatSubCategory(newSubCategory) });
  } catch (err) {
    console.error(`Error creating sub-category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;

  if (!subCategoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing sub-category ID" }] });
  }

  try {
    const deletedSubCategory = await SubCategoryModel.delete(subCategoryId);
    if (!deletedSubCategory) {
      return res
        .status(404)
        .json({ errors: [{ message: "Sub-category not found" }] });
    }
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting sub-category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateSubCategory = async (req, res) => {
  const subCategoryId = req.params.id;
  const { error } = subCategorySchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const { name, id_category } = req.body;

  if (!subCategoryId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing sub-category ID" }] });
  }

  try {
    const updatedSubCategory = await SubCategoryModel.update(subCategoryId, { name, id_category });

    if (!updatedSubCategory) {
      return res
        .status(404)
        .json({ errors: [{ message: "Sub-category not found" }] });
    }

    res.status(200).json({ data: formatSubCategory(updatedSubCategory) });
  } catch (err) {
    console.error(`Error updating sub-category: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
