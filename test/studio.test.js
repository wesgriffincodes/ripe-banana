require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Reviewer = require('../lib/models/Reviewer');
const Review = require('../lib/models/Review');

describe('studio routes', () => {
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

  it('can create a studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'universal', address: { city: 'LA', state: 'California', country: 'USA' } })
      .then(res => {
        expect(res.body).toEqual({
          _id:expect.any(String),
          name: 'universal',
          address: {
            city: 'LA',
            state: 'California',
            country: 'USA'
          },
          __v: 0
        });
      });
  }); 

  it('can get studios', async() => {
    const studios = await Studio.create([
      { name: 'universal' },
      { name: 'something' },
      { name: 'who cares' }
    ]);

    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach(studio => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  it('GET studio by id', async() => {
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: studio._id,
          name: studio.name,
          address: studio.address,
          films: [{
            _id: film._id,
            title: film.title
          }]
        });
      });
  });
});
