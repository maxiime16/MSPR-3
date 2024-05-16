const MessageModel = require("../models/messageModel");
const messageSchema = require("../schemas/messageSchema");

exports.getAllMessages = async (req, res) => {
  try {
    const messages = await MessageModel.getAll();
    res.status(200).json({ data: messages });
  } catch (err) {
    console.error(`Error fetching messages: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getMessagesByConversationId = async (req, res) => {
  const conversationId = req.params.conversation_id;
  if (!conversationId) {
    return res.status(400).json({ errors: [{ message: "Missing conversation ID" }] });
  }
  try {
    const messages = await MessageModel.getByConversationId(conversationId);
    res.status(200).json({ data: messages });
  } catch (err) {
    console.error(`Error fetching messages by conversation ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.getMessageById = async (req, res) => {
  const messageId = req.params.id;
  if (!messageId) {
    return res.status(400).json({ errors: [{ message: "Missing message ID" }] });
  }
  try {
    const message = await MessageModel.getById(messageId);
    res.status(200).json({ data: message });
  } catch (err) {
    console.error(`Error fetching message by ID: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.createMessage = async (req, res) => {
  const { error, value } = messageSchema.validate(req.body);

  if (error) {
    return res.status(400).json({ errors: [{ message: error.details[0].message }] });
  }

  try {
    const newMessage = await MessageModel.create(value);
    res.status(201).json({ data: newMessage });
  } catch (err) {
    console.error(`Error creating message: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};

exports.deleteMessage = async (req, res) => {
  const messageId = req.params.id;

  if (!messageId) {
    return res.status(400).json({ errors: [{ message: "Missing message ID" }] });
  }

  try {
    await MessageModel.delete(messageId);
    res.status(204).send();
  } catch (err) {
    console.error(`Error deleting message: ${err.message}`);
    res.status(500).json({ errors: [{ message: "Server Error" }] });
  }
};
