require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose')
const request = require('supertest');
const app = require('../../app');
const User = require('../models/model.js');
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const {generatePasswordResetToken} = require('../controllers/controller.js')


describe('User Registration Endpoint', () => {
    test('should register a new user', async () => {
        const userData = {
            username: 'dummyUser',
            password: 'testpassword',
            confirmPassword: 'testpassword',
            email: 'dummyUserg@example.com',
            firstName: 'Test',
            lastName: 'User'
        };
        const response = await request(app)
            .post('/users/register')
            .send(userData);

        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

});

describe('Login Endpoint', () => {
    test('should login the user', async () => {
        
        const loginData = {
            username: 'vivek',
            password: 'testpassword'
        };

        const response = await request(app)
            .post('/users/login')
            .send(loginData);

        console.log('Response:', response.status, response.body);
        expect(response.statusCode).toBe(200);
        expect(response.body).toHaveProperty('message', 'Login successful');
    });
});

describe('Get User Endpoint', () => {
    test('should return user details', async () => {

        const mockUserId = '663a044d46e99e762755ceb8';

        const mockUser = {
            _id: '663a044d46e99e762755ceb8',
            username: 'vivek',
            email: 'vivek@example.com',
            firstName: 'Test',
            lastName: 'User'
        };

        jest.mock('../models/model.js', () => ({
            findOne: jest.fn().mockResolvedValue(mockUser)
        }));

        const response = await request(app)
            .get(`/users/${mockUserId}`);
        
        console.log('Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
});

describe('Delete User Endpoint', () => {
    test('should delete a user', async () => {
        
        const mockAccessToken = '663a044d46e99e762755ceb8';
        const requestHeaders = {
            access_token: mockAccessToken,
        };

        User.deleteOne = jest.fn().mockResolvedValue(mockAccessToken);

        const response = await request(app)
            .delete('/users/663a044d46e99e762755ceb8')
            .set(requestHeaders);
        console.log('Response:', response.status, response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'User deleted' });
    });
});

describe('List Users Endpoint', () => {
    test('should return a list of users', async () => {
        const response = await request(app).get('/users/list/1');
        console.log('Response:', response.body);
        expect(response.status).toBe(200);
    });
});

describe('Add Address Endpoint', () => {
    test('should add an address for a user', async () => {

        const requestBody = {
            user_id: '663b21b4f5c5b2e5843b3cfa', 
            address: '123 Main St',
            city: 'City',
            state: 'State',
            pin_code: '12345',
            phone_no: '1234567890'
        };

        User.findOne = jest.fn().mockResolvedValue({ _id: '663b21b4f5c5b2e5843b3cfa'});

        const response = await request(app)
            .post('/users/663b21b4f5c5b2e5843b3cfa/address')
            .send(requestBody);
        console.log('Response:', response.body);
        expect(response.status).toBe(200);
        expect(response.body).toBe('Address added successfully');
    });
});

describe('Delete Addresses Endpoint', () => {
    test('should delete addresses for a user', async () => {
        
        const mockAccessToken = '663b21b4f5c5b2e5843b3cfa';
        const mockAddressIds = ['663b4a8dd58ed65d3ca271c0', '663b4a9cd58ed65d3ca271c4'];

        const requestBody = {
            address_ids: mockAddressIds
        };
        const requestHeaders = {
            access_token: mockAccessToken,
        }
        User.findById = jest.fn().mockResolvedValue(mockAccessToken);

        const response = await request(app)
            .delete('/users/663b21b4f5c5b2e5843b3cfa/address')
            .set(requestHeaders)
            .send(requestBody);
        console.log('Response:',response.body);
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Addresses deleted successfully' });

    });

});


describe('generatePasswordResetToken', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const req = {
        body: {
            email: 'tevivaashusg@example.com'
        }
    };
    
    const res = {
        status: jest.fn(() => res),
        json: jest.fn(),
    };
        it('should return token and success message if email exists', async () => {
        const mockUser = {
            email: 'tevivaashusg@example.com'
        };
        jest.mock('jsonwebtoken');
            jwt.sign = jest.fn(() => 'mockedToken');

        jest.mock('../models/model.js', () => ({
            findOne: jest.fn().mockResolvedValue(mockUser)
                      }));

        await generatePasswordResetToken(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ token: 'mockedToken', message: 'Token Expires in 15 minutes' });
    });
});



afterAll(async () => {
    await mongoose.disconnect();
  });


