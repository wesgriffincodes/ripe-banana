require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Review = require('../lib/models/Review');
const Reviewer = require('../lib/models/Reviewer');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');


describe('review routes', () => {
  beforeAll(() => {
    connect();
  });

    
  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let reviewer = null;
  let studio = null;
  let actor = null;
  let film = null;
  beforeEach(async() => {
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'Boss Hoss', company: 'new line' })));
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Joshua Jackson' })));
    studio = JSON.parse(JSON.stringify(await Studio.create({ name: 'universal' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })));
  });


  afterAll(() => {
    return mongoose.connection.close();
  });

  it('creates a review', () => {
    return request(app)
      .post('/api/v1/reviews')
      .send({ rating: 3, review: 'Well, that movie sucked', reviewer: reviewer._id, film: film._id })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 3,
          review: 'Well, that movie sucked',
          reviewer: reviewer._id.toString(),
          film: film._id.toString(),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          __v: 0
        });
      });
  });


  it('GET all reviews', async() => {

    await Promise.all([...Array(101)].map(() => {
      return Review.create({
        rating: 5,
        reviewer: reviewer._id,
        review: 'neat',
        film: film._id,
      });
    }));

    return request(app)
      .get('/api/v1/reviews')
      .then(res => {
        expect(res.body[0]).toEqual({
          _id: expect.any(String),
          rating: 5,
          review: expect.any(String),
          film: {
            _id: film._id,
            title: film.title
          },
        });
      });
  });

});
