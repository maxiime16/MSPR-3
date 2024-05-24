const PlantModel = require("../models/plantModel");
const plantSchema = require("../schemas/plantSchema");

const formatPlant = (plant) => ({
  type: "plants",
  id: plant.plantid,
  attributes: {
    name_plant: plant.name_plant,
    description: plant.description,
    advertisement_id: plant.advertisementid,
    subcategory_id: plant.subcategoryid,
  },
});

exports.getAllPlants = async (req, res) => {
  try {
    const plants = await PlantModel.getAll();
    const responseData = plants.map(formatPlant);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching plants: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getPlantById = async (req, res) => {
  const plantId = req.params.id;
  if (!plantId) {
    return res.status(400).json({ errors: [{ message: "Missing plant ID" }] });
  }
  try {
    const plant = await PlantModel.getById(plantId);
    res.status(200).json({ data: formatPlant(plant) });
  } catch (err) {
    console.error(`Error fetching plant by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createPlant = async (req, res) => {
  const { error } = plantSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { name_plant, description, advertisement_id, subcategory_id } = req.body;

  try {
    const newPlant = await PlantModel.create({ name_plant, description, advertisement_id, subcategory_id });
    res.status(201).json({ data: formatPlant(newPlant) });
  } catch (err) {
    console.error(`Error creating plant: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deletePlant = async (req, res) => {
  const plantId = req.params.id;

  if (!plantId) {
    return res.status(400).json({ errors: [{ message: "Missing plant ID" }] });
  }

  try {
    const deletedPlant = await PlantModel.delete(plantId);
    res.status(204).json();
  } catch (err) {
    console.error(`Error deleting plant: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updatePlant = async (req, res) => {
  const plantId = req.params.id;
  const { error } = plantSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { name_plant, description, advertisement_id, subcategory_id } = req.body;

  if (!plantId) {
    return res.status(400).json({ errors: [{ message: "Missing plant ID" }] });
  }

  try {
    const updatedPlant = await PlantModel.update(plantId, { name_plant, description, advertisement_id, subcategory_id });

    if (!updatedPlant) {
      return res.status(404).json({ errors: [{ message: "Plant not found" }] });
    }

    res.status(200).json({ data: formatPlant(updatedPlant) });
  } catch (err) {
    console.error(`Error updating plant: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};