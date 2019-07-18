require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('create an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'jcvd', dob: '11-13-1970', pob: 'Brussels' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'jcvd',
          dob: expect.any(String),
          pob: 'Brussels',
          __v: 0
        });
      });
  });

  it('gets actors', async() => {
    const actors = await Actor.create([
      { name: 'jcvd' },
      { name: 'Kurt Russel' },
      { name: 'Steve Martin' }
    ]);

    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach(actor => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });

});
