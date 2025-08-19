const { registerUser } = require('../controllers/userController');

//Mock user model function
jest.mock('../models/userModel', () => {
  //Mock user model
  const mockUser = {
    _id: 'user-id',
    name: 'John Doe',
    email: 'john@gmail.com',
  };

  return {
    findOne: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockResolvedValue(mockUser),
  };
});

//Mock JWT
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn().mockResolvedValue('mock-token'),
}));

//Mock bcrypt
const bcrypt = require('bcryptjs');

bcrypt.genSalt = jest.fn().mockResolvedValue('mock-salt'); //Value it will resolve to
bcrypt.hash = jest.fn().mockResolvedValue('mock-hashed-password'); //Value it will resolve to

//Testing for a new user
test('Should register a new user', async () => {
  const req = {
    body: {
      name: 'John Doe',
      email: 'john@gmail.com',
      password: 'password',
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await registerUser(req, res);
  expect(res.status).toHaveBeenCalledWith(201);
});

//Testing for error case when a field is missing
test('should return a 400 error if any field is missing', async () => {
  const req = {
    body: {
      name: 'John Doe',
      email: '', //Missing email field intentionally
      password: 'password',
    },
  };
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  await expect(registerUser(req, res)).rejects.toThrow('All fields are mandatory');
  expect(res.status).toHaveBeenCalledWith(400);
});
