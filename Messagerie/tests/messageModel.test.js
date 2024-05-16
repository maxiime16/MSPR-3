const MessageModel = require('../models/messageModel');
const pool = require('../config/db');

jest.mock('../config/db');

describe('MessageModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all messages', async () => {
      const mockMessages = [{ id: 1, content: 'Hello' }, { id: 2, content: 'Hi' }];
      pool.query.mockResolvedValue({ rows: mockMessages });

      const result = await MessageModel.getAll();
      expect(result).toEqual(mockMessages);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM messages');
    });

    it('should throw an error if retrieval fails', async () => {
      pool.query.mockRejectedValue(new Error('Error retrieving messages'));
      
      await expect(MessageModel.getAll()).rejects.toThrow('Error retrieving messages: Error retrieving messages');
    });
  });

  describe('getByConversationId', () => {
    it('should return messages by conversation ID', async () => {
      const mockMessages = [{ id: 1, conversation_id: 1, content: 'Hello' }];
      pool.query.mockResolvedValue({ rows: mockMessages });

      const result = await MessageModel.getByConversationId(1);
      expect(result).toEqual(mockMessages);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM messages WHERE conversation_id = $1', [1]);
    });

    it('should throw an error if retrieval fails', async () => {
      pool.query.mockRejectedValue(new Error('Error retrieving messages by conversation ID'));
      
      await expect(MessageModel.getByConversationId(1)).rejects.toThrow('Error retrieving messages by conversation ID: Error retrieving messages by conversation ID');
    });
  });

  describe('getById', () => {
    it('should return a message by ID', async () => {
      const mockMessage = { id: 1, content: 'Hello' };
      pool.query.mockResolvedValue({ rows: [mockMessage] });

      const result = await MessageModel.getById(1);
      expect(result).toEqual(mockMessage);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM messages WHERE id = $1', [1]);
    });

    it('should throw an error if message not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(MessageModel.getById(1)).rejects.toThrow('Message not found');
    });

    it('should throw an error if retrieval fails', async () => {
      pool.query.mockRejectedValue(new Error('Error retrieving message'));
      
      await expect(MessageModel.getById(1)).rejects.toThrow('Error retrieving message: Error retrieving message');
    });
  });

  describe('create', () => {
    it('should create a new message', async () => {
      const mockMessage = { id: 1, conversation_id: 1, sender_id: 1, content: 'Hello' };
      pool.query.mockResolvedValue({ rows: [mockMessage] });

      const result = await MessageModel.create({ conversation_id: 1, sender_id: 1, content: 'Hello' });
      expect(result).toEqual(mockMessage);
      expect(pool.query).toHaveBeenCalledWith(
        'INSERT INTO messages (conversation_id, sender_id, content) VALUES ($1, $2, $3) RETURNING *',
        [1, 1, 'Hello']
      );
    });

    it('should throw an error if creation fails', async () => {
      pool.query.mockRejectedValue(new Error('Error creating message'));
      
      await expect(MessageModel.create({ conversation_id: 1, sender_id: 1, content: 'Hello' }))
        .rejects.toThrow('Error creating message: Error creating message');
    });
  });

  describe('delete', () => {
    it('should delete a message', async () => {
      const mockMessage = { id: 1, content: 'Hello' };
      pool.query.mockResolvedValue({ rows: [mockMessage] });

      const result = await MessageModel.delete(1);
      expect(result).toEqual(mockMessage);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM messages WHERE id = $1 RETURNING *', [1]);
    });

    it('should throw an error if message not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(MessageModel.delete(1)).rejects.toThrow('Message not found');
    });

    it('should throw an error if deletion fails', async () => {
      pool.query.mockRejectedValue(new Error('Error deleting message'));
      
      await expect(MessageModel.delete(1)).rejects.toThrow('Error deleting message: Error deleting message');
    });
  });
});
