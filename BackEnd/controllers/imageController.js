const ImageModel = require("../models/imageModel");
const imageSchema = require("../schemas/imageSchema");

exports.getAllImages = async (req, res) => {
  try {
    const images = await ImageModel.getAll();
    res.status(200).json({ data: images });
  } catch (err) {
    console.error(`Error fetching images: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getImageById = async (req, res) => {
  const imageId = req.params.id;
  if (!imageId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing image ID" }] });
  }
  try {
    const image = await ImageModel.getById(imageId);
    res.status(200).json({ data: image });
  } catch (err) {
    console.error(`Error fetching image by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getImagesByPlantId = async (req, res) => {
  const plantId = req.params.plant_id;
  if (!plantId) {
    return res.status(400).json({ errors: [{ message: "Missing plant ID" }] });
  }
  try {
    const images = await ImageModel.getByPlantId(plantId);
    res.status(200).json({ data: images });
  } catch (err) {
    console.error(`Error fetching images by plant ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createImage = async (req, res) => {
  const { error } = imageSchema.validate(req.body);
  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  const { image, plant_id } = req.body;

  try {
    const newImage = await ImageModel.create({
      image,
      plant_id,
    });

    console.log('New image created:', newImage);

    res.status(201).json({ success: true, data: newImage });
  } catch (err) {
    console.error(`Error creating image: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};


exports.deleteImage = async (req, res) => {
  const imageId = req.params.id;

  if (!imageId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing image ID" }] });
  }

  try {
    await ImageModel.delete(imageId);
    res.status(204).json();
  } catch (err) {
    console.error(`Error deleting image: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
