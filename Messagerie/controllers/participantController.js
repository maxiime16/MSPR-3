const ParticipantModel = require("../models/participantModel");
const participantSchema = require("../schemas/participantSchema");

exports.getAllParticipants = async (req, res) => {
  try {
    const participants = await ParticipantModel.getAll();
    res.status(200).json({ data: participants });
  } catch (err) {
    console.error(`Error fetching participants: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getParticipantsByConversationId = async (req, res) => {
  const conversationId = req.params.conversation_id;
  if (!conversationId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing conversation ID" }] });
  }
  try {
    const participants = await ParticipantModel.getByConversationId(
      conversationId
    );
    res.status(200).json({ data: participants });
  } catch (err) {
    console.error(
      `Error fetching participants by conversation ID: ${err.message}`
    );
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getParticipantsByUserId = async (req, res) => {
  const userId = req.params.user_id;
  if (!userId) {
    return res.status(400).json({ errors: [{ message: "Missing user ID" }] });
  }
  try {
    const participants = await ParticipantModel.getByUserId(userId);
    res.status(200).json({ data: participants });
  } catch (err) {
    console.error(`Error fetching participants by user ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.addParticipant = async (req, res) => {
  const { error, value } = participantSchema.validate(req.body);

  if (error) {
    return res
      .status(400)
      .json({ errors: [{ message: error.details[0].message }] });
  }

  try {
    const newParticipant = await ParticipantModel.create(value);
    res.status(201).json({ data: newParticipant });
  } catch (err) {
    console.error(`Error adding participant: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteParticipant = async (req, res) => {
  const participantId = req.params.id;

  if (!participantId) {
    return res
      .status(400)
      .json({ errors: [{ message: "Missing participant ID" }] });
  }

  try {
    await ParticipantModel.delete(participantId);
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting participant: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
