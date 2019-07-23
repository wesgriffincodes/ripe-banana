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
  let reviewer = null;
  let review = null;
  beforeEach(async() => {
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'universal' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Ben Kingsley'  })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'bobby bling', company: 'who cares' })));
    review = JSON.parse(JSON.stringify(await Review.create({ rating: 3, reviewer: reviewer._id, review:'another review', film: film._id })));
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
        expect(res.body).toContainEqual({
          _id: expect.any(String),
          title: 'Captain Ron',
          released: 1993,
          studio: {
            _id: studio._id,
            name: studio.name
          }

        });

      });
  });

  it('Gets film by ID', async() => {
    return request(app)
      .get(`/api/v1/films/${film._id}`)
      .then(res => {
        expect(res.body).toEqual({
          title: 'Captain Ron',
          studio: {
            _id: studio._id.toString(),
            name: studio.name
          },
          released: 1993,
          cast: [{
            _id: expect.any(String),
            role: 'Captain',
            actor: {
              _id: actor._id,
              name: actor.name
            }
          }],
          reviews: [{
            _id: review._id, 
            rating: review.rating, 
            review: review.review,
            reviewer: {
              _id: reviewer._id,
              name: reviewer.name
            }
          }]

        });
      });
  });

  it('DELETE a film by id', async() => {
    return request(app)
      .delete(`/api/v1/films/${film._id}`)
      .then(res => {
        const deleteFilm = JSON.parse(JSON.stringify(film));
        expect(res.body).toEqual(deleteFilm);
      });
  });
});
