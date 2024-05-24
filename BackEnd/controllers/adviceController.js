const AdviceModel = require("../models/adviceModel");
const adviceSchema = require("../schemas/adviceSchema");

const formatAdvice = (advice) => ({
  type: "advice",
  id: advice.adviceid,
  attributes: {
    content: advice.content,
    user_id: advice.userid,
    plant_id: advice.plantid,
  },
});

exports.getAllAdvice = async (req, res) => {
  try {
    const adviceList = await AdviceModel.getAll();
    const responseData = adviceList.map(formatAdvice);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching advice: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdviceById = async (req, res) => {
  const adviceId = req.params.id;
  if (!adviceId) {
    return res.status(400).json({ errors: [{ message: "Missing advice ID" }] });
  }
  try {
    const advice = await AdviceModel.getById(adviceId);
    res.status(200).json({ data: formatAdvice(advice) });
  } catch (err) {
    console.error(`Error fetching advice by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createAdvice = async (req, res) => {
  const { error } = adviceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { content, user_id, plant_id } = req.body;

  try {
    const newAdvice = await AdviceModel.create({ content, user_id, plant_id });
    res.status(201).json({ data: formatAdvice(newAdvice) });
  } catch (err) {
    console.error(`Error creating advice: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteAdvice = async (req, res) => {
  const adviceId = req.params.id;

  if (!adviceId) {
    return res.status(400).json({ errors: [{ message: "Missing advice ID" }] });
  }

  try {
    const deletedAdvice = await AdviceModel.delete(adviceId);
    res.status(204).json();
  } catch (err) {
    console.error(`Error deleting advice: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateAdvice = async (req, res) => {
  const adviceId = req.params.id;
  const { error } = adviceSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  const { content, user_id, plant_id } = req.body;

  if (!adviceId) {
    return res.status(400).json({ errors: [{ message: "Missing advice ID" }] });
  }

  try {
    const updatedAdvice = await AdviceModel.update(adviceId, { content, user_id, plant_id });

    if (!updatedAdvice) {
      return res.status(404).json({ errors: [{ message: "Advice not found" }] });
    }

    res.status(200).json({ data: formatAdvice(updatedAdvice) });
  } catch (err) {
    console.error(`Error updating advice: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
