const ParticipantController = require('../controllers/participantController');
const ParticipantModel = require('../models/participantModel');
const { mockRequest, mockResponse } = require('../utils/testUtils');

jest.mock('../models/participantModel');

describe('ParticipantController', () => {
  beforeAll(() => {
    console.error = jest.fn(); // Désactiver la journalisation des erreurs
  });

  afterAll(() => {
    console.error.mockRestore(); // Restaurer la journalisation des erreurs
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllParticipants', () => {
    it('should return all participants', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      ParticipantModel.getAll.mockResolvedValue(mockParticipants);

      const req = mockRequest();
      const res = mockResponse();

      await ParticipantController.getAllParticipants(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockParticipants });
    });

    it('should handle server error', async () => {
      ParticipantModel.getAll.mockRejectedValue(new Error('Server Error'));

      const req = mockRequest();
      const res = mockResponse();

      await ParticipantController.getAllParticipants(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Server Error' }] });
    });
  });

  describe('getParticipantsByConversationId', () => {
    it('should return participants by conversation ID', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      ParticipantModel.getByConversationId.mockResolvedValue(mockParticipants);

      const req = mockRequest();
      req.params.conversation_id = 1;
      const res = mockResponse();

      await ParticipantController.getParticipantsByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockParticipants });
    });

    it('should return 400 if conversation ID is missing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await ParticipantController.getParticipantsByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Missing conversation ID' }] });
    });

    it('should handle server error', async () => {
      ParticipantModel.getByConversationId.mockRejectedValue(new Error('Server Error'));

      const req = mockRequest();
      req.params.conversation_id = 1;
      const res = mockResponse();

      await ParticipantController.getParticipantsByConversationId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Server Error' }] });
    });
  });

  describe('getParticipantsByUserId', () => {
    it('should return participants by user ID', async () => {
      const mockParticipants = [{ id: 1, user_id: 1, conversation_id: 1 }];
      ParticipantModel.getByUserId.mockResolvedValue(mockParticipants);

      const req = mockRequest();
      req.params.user_id = 1;
      const res = mockResponse();

      await ParticipantController.getParticipantsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockParticipants });
    });

    it('should return 400 if user ID is missing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await ParticipantController.getParticipantsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Missing user ID' }] });
    });

    it('should handle server error', async () => {
      ParticipantModel.getByUserId.mockRejectedValue(new Error('Server Error'));

      const req = mockRequest();
      req.params.user_id = 1;
      const res = mockResponse();

      await ParticipantController.getParticipantsByUserId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Server Error' }] });
    });
  });

  describe('addParticipant', () => {
    it('should add a new participant', async () => {
      const mockParticipant = { id: 1, user_id: 1, conversation_id: 1 };
      ParticipantModel.create.mockResolvedValue(mockParticipant);

      const req = mockRequest();
      req.body = { user_id: 1, conversation_id: 1 };
      const res = mockResponse();

      await ParticipantController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: mockParticipant });
    });

    it('should return 400 if validation fails', async () => {
      const req = mockRequest();
      req.body = { user_id: 1 }; // Missing conversation_id
      const res = mockResponse();

      await ParticipantController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: '"conversation_id" is required' }] });
    });

    it('should handle server error', async () => {
      ParticipantModel.create.mockRejectedValue(new Error('Server Error'));

      const req = mockRequest();
      req.body = { user_id: 1, conversation_id: 1 };
      const res = mockResponse();

      await ParticipantController.addParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Server Error' }] });
    });
  });

  describe('deleteParticipant', () => {
    it('should delete a participant', async () => {
      ParticipantModel.delete.mockResolvedValue();

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ParticipantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('should return 400 if participant ID is missing', async () => {
      const req = mockRequest();
      const res = mockResponse();

      await ParticipantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Missing participant ID' }] });
    });

    it('should handle server error', async () => {
      ParticipantModel.delete.mockRejectedValue(new Error('Server Error'));

      const req = mockRequest();
      req.params.id = 1;
      const res = mockResponse();

      await ParticipantController.deleteParticipant(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ errors: [{ message: 'Server Error' }] });
    });
  });
});
