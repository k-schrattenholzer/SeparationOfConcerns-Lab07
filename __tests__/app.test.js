const pool = require('../lib/utils/pool');
// const twilio = require('twilio');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn()
  }
}));

describe('03_separation-of-concerns-demo routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new order in our database and sends a text message', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then(res => {
        // expect(createMessage).toHaveBeenCalledTimes(1);
        expect(res.body).toEqual({
          id: '1',
          quantity: 10
        });
      });
  });

  it('given an ID, get returns the order with that ID', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 14 });
      
    return request(app)
      .get('/api/v1/orders/1')
      .then(res => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 14
        });
      });
  });

  it('given no ID, get returns an array of all orders', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 });
      
    return request(app)
      .get('/api/v1/orders')
      .then(res => {
        expect(res.body).toEqual(expect.arrayContaining([{
          id: '1',
          quantity: 10
        }]));
      });
  });

  it('returns an updated order when provided an ID', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 4 });
    
    await request(app)
      .patch('/api/v1/orders/1')
      .send({ quantity: 7 });

    return request(app)
      .get('/api/v1/orders/1')
      .then(res => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 7
        });
      });
  });

  it('deletes an order when provided an ID', async() => {
    await request(app)
      .post('/api/v1/orders')
      .send({ quantity: 4 });

    return request(app)
      .get('/api/v1/orders/1')
      .then(res => {
        expect(res.statusCode).toEqual(200);
      });
  });
});
