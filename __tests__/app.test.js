const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const Order = require('../lib/models/Order');

jest.mock('twilio', () => () => ({
  messages: {
    create: jest.fn(),
  },
}));

describe('oder routes, boiiiii', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new order and sends a text', () => {
    return request(app)
      .post('/api/v1/orders')
      .send({ quantity: 10 })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 10,
        });
      });
  });

  it('gets all orders', async () => {
    const order = await Order.insert({ quantity: 10 });

    return request(app)
      .get('/api/v1/orders')
      .then((res) => {
        
        expect(res.body).toEqual([order]);
      });
  });

  it('gets an order by id', async () => {
    const order = await Order.insert({ quantity: 10 });
    return request(app)
      .get(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).toEqual(order);
      });
  });

  it('updates an order by id', async () => {
    const order = await Order.insert({ quantity: 10 });

    return request(app)
      .put(`/api/v1/orders/${order.id}`)
      .send({ quantity: 5 })
      .then((res) => {
        expect(res.body).toEqual({
          id: '1',
          quantity: 5,
        });
      });
  });

  it('deletes an order by id', async () => {
    const order = await Order.insert({ quantity: 10 });

    return request(app)
      .delete(`/api/v1/orders/${order.id}`)
      .then((res) => {
        expect(res.body).not.toContain(order);
      });
  });
});
