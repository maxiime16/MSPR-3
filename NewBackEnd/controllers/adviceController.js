const AdviceModel = require("../models/adviceModel");
const adviceSchema = require("../schemas/adviceSchema");

const formatAdvice = (advice) => ({
  type: "advices",
  id: advice.id,
  attributes: {
    advice: advice.advice,
    advertisement_id: advice.advertisement_id,
    user_id: advice.user_id,
  },
});

exports.getAllAdvices = async (req, res) => {
  try {
    const advices = await AdviceModel.getAll();
    const responseData = advices.map(formatAdvice);
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(`Error fetching advices: ${err.message}`);
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

  const { advice, advertisement_id, user_id } = req.body;

  try {
    const newAdvice = await AdviceModel.create({ advice, advertisement_id, user_id });
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
    await AdviceModel.delete(adviceId);
    res.status(204).send();
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

  const { advice, advertisement_id, user_id } = req.body;

  if (!adviceId) {
    return res.status(400).json({ errors: [{ message: "Missing advice ID" }] });
  }

  try {
    const updatedAdvice = await AdviceModel.update(adviceId, { advice, advertisement_id, user_id });
    res.status(200).json({ data: formatAdvice(updatedAdvice) });
  } catch (err) {
    console.error(`Error updating advice: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
