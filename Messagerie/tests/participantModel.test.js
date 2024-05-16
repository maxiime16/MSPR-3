const ParticipantModel = require('../models/participantModel');
const pool = require('../config/db');

jest.mock('../config/db');

describe('ParticipantModel', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all participants', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      pool.query.mockResolvedValue({ rows: mockParticipants });

      const participants = await ParticipantModel.getAll();
      expect(participants).toEqual(mockParticipants);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM participants');
    });

    it('should throw an error if database query fails', async () => {
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(ParticipantModel.getAll()).rejects.toThrow('Error retrieving participants: Database Error');
    });
  });

  describe('getByConversationId', () => {
    it('should return participants by conversation ID', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      pool.query.mockResolvedValue({ rows: mockParticipants });

      const participants = await ParticipantModel.getByConversationId(1);
      expect(participants).toEqual(mockParticipants);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM participants WHERE conversation_id = $1', [1]);
    });

    it('should throw an error if database query fails', async () => {
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(ParticipantModel.getByConversationId(1)).rejects.toThrow('Error retrieving participants by conversation ID: Database Error');
    });
  });

  describe('getByUserId', () => {
    it('should return participants by user ID', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      pool.query.mockResolvedValue({ rows: mockParticipants });

      const participants = await ParticipantModel.getByUserId(1);
      expect(participants).toEqual(mockParticipants);
      expect(pool.query).toHaveBeenCalledWith('SELECT * FROM participants WHERE user_id = $1', [1]);
    });

    it('should throw an error if database query fails', async () => {
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(ParticipantModel.getByUserId(1)).rejects.toThrow('Error retrieving participants by user ID: Database Error');
    });
  });

  describe('create', () => {
    it('should create a new participant', async () => {
      const mockParticipant = { id: 1, user_id: 1, conversation_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockParticipant] });

      const newParticipant = await ParticipantModel.create({ user_id: 1, conversation_id: 1 });
      expect(newParticipant).toEqual(mockParticipant);
      expect(pool.query).toHaveBeenCalledWith('INSERT INTO participants (user_id, conversation_id) VALUES ($1, $2) RETURNING *', [1, 1]);
    });

    it('should throw an error if database query fails', async () => {
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(ParticipantModel.create({ user_id: 1, conversation_id: 1 })).rejects.toThrow('Error creating participant: Database Error');
    });
  });

  describe('delete', () => {
    it('should delete a participant', async () => {
      const mockParticipant = { id: 1, user_id: 1, conversation_id: 1 };
      pool.query.mockResolvedValue({ rows: [mockParticipant] });

      const deletedParticipant = await ParticipantModel.delete(1);
      expect(deletedParticipant).toEqual(mockParticipant);
      expect(pool.query).toHaveBeenCalledWith('DELETE FROM participants WHERE id = $1 RETURNING *', [1]);
    });

    it('should throw an error if participant not found', async () => {
      pool.query.mockResolvedValue({ rows: [] });

      await expect(ParticipantModel.delete(1)).rejects.toThrow('Participant not found');
    });

    it('should throw an error if database query fails', async () => {
      pool.query.mockRejectedValue(new Error('Database Error'));

      await expect(ParticipantModel.delete(1)).rejects.toThrow('Error deleting participant: Database Error');
    });
  });
});
