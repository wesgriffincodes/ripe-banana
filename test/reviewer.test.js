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

describe('reviewer routes', () => {
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

  it('creates reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'bob', company: 'dork' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: expect.any(String),
          company: expect.any(String),
          __v: 0
        });
      });
  });

  it('gets reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'bob', company: 'b' },
      { name: 'nick', company: 'z' }
    ]);

    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach(reviewer => {
          expect(res.body).toContainEqual({ name: reviewer.name, company: reviewer.company, _id: reviewer._id });
        });
      });
  });

  it('GET reviewer by id', async() => {
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: reviewer.name,
          company: reviewer.company,
          reviews: [{
            _id: review._id,
            rating: review.rating,
            review: review.review,
            film: {
              _id: film._id,
              title: film.title
            }
          }]

        });
      });
  });

});

