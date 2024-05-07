const AdviceModel = require("../models/adviceModel");

exports.getAllAdvices = async (req, res) => {
  try {
    const advices = await AdviceModel.getAll();
    const responseData = advices.map((advice) => ({
      type: "advices",
      id: advice.id,
      attributes: {
        advertisement_id: advice.advertisement_id,
        user_id: advice.user_id,
        advice: advice.advice,
      },
    }));
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getAdviceById = async (req, res) => {
  const adviceId = req.params.id;
  try {
    const advice = await AdviceModel.getById(adviceId);
    const responseData = {
      type: "advices",
      id: advice.id,
      attributes: {
        advertisement_id: advice.advertisement_id,
        user_id: advice.user_id,
        advice: advice.advice,
      },
    };
    res.status(200).json({ data: responseData });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createAdvice = async (req, res) => {
  const { advice, advertisement_id, user_id } = req.body;

  try {
    const newAdvice = await AdviceModel.create({
      advice,
      advertisement_id,
      user_id,
    });

    res.status(201).json({ data: newAdvice });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteAdvice = async (req, res) => {
  const adviceId = req.params.id;

  try {
    await AdviceModel.delete(adviceId);

    res.status(204).json({ message: "Advice deleted succesfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.updateAdvice = async (req, res) => {
  const adviceId = req.params.id;
  const { advice, advertisement_id, user_id } = req.body;

  try {
    const updatedAdvice = await AdviceModel.update(adviceId, {
      advice,
      advertisement_id,
      user_id,
    });

    res.status(200).json({ data: updatedAdvice });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
