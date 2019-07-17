require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

describe('studio routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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
          console.log(studio);
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });

  // it('get studio by id', async() => {
  //   const studio = await Studio.create({ name: 'universal', address: { city: 'LA', state: 'California', country: 'USA' } });
  //   const films = await Film.create([
  //     { name: 'y', studio: studio._id },
  //     { name: 'c', studio: studio._id }
  //   ]);

  //   return request(app)
  //     .get(`/api/v1/studios/${studio._id}`)
  //     .then(res => {
  //       const filmsJSON = JSON.parse(JSON.stringify(films));
  //       expect(res.body.name).toEqual('universal');
  //       filmsJSON.forEach(film => {
  //         expect(res.body.films).toContainEqual(film);
  //       });
  //     });
  // });
});
