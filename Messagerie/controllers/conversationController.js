const ConversationModel = require("../models/conversationModel");
const conversationSchema = require("../schemas/conversationSchema");

exports.getAllConversations = async (req, res) => {
  try {
    const conversations = await ConversationModel.getAll();
    res.status(200).json({ data: conversations });
  } catch (err) {
    console.error(`Error fetching conversations: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getConversationById = async (req, res) => {
  const { id } = req.params;
  try {
    const conversation = await ConversationModel.getById(id);
    if (!conversation) {
      return res.status(404).json({ errors: [{ message: "Conversation not found" }] });
    }
    res.status(200).json({ data: conversation });
  } catch (err) {
    console.error(`Error fetching conversation by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createConversation = async (req, res) => {
  const { error } = conversationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  try {
    const newConversation = await ConversationModel.create();
    res.status(201).json({ data: newConversation });
  } catch (err) {
    console.error(`Error creating conversation: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteConversation = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await ConversationModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ errors: [{ message: "Conversation not found" }] });
    }
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting conversation: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
