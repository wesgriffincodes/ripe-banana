require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
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

});
