require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });

    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor = null;
  let film = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'universal' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Ben Kingsley'  })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })));
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('can create a film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Captain Ron',
          studio: studio._id.toString(),
          released: 1993,
          cast: [{
            role: expect.any(String),
            actor: actor._id.toString(),
            _id: expect.any(String)
          }],
          __v: 0
        });
      });
  });

  it('gets films', () => {
    return request(app)
      .get('/api/v1/films')
      .then(res => {
        expect(res.body).toEqual([{
          _id: expect.any(String),
          title: 'Captain Ron',
          released: 1993,
          studio: {
            _id: studio._id,
            name: studio.name
          }

        }]);

      });
  });

});
