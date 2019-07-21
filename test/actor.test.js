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


describe('actor routes', () => {
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
    actor = JSON.parse(JSON.stringify(await Actor.create({ name: 'Ben Kingsley', dob: new Date(1944, 11, 11), pob: 'London' })));
    film = JSON.parse(JSON.stringify(await Film.create({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'bobby bling', company: 'who cares' })));
    review = JSON.parse(JSON.stringify(await Review.create({ rating: 3, reviewer: reviewer._id, review:'another review', film: film._id })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });


  it('create an actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Ben Kingsley' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ben Kingsley',
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

  it('GET actor by ID', async() => {
    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          name: actor.name,
          dob: actor.dob,
          pob: actor.pob,
          films: [{
            _id: film._id,
            title: film.title,
            released: 1993
          }]
        });
      });
  });


  it('can update a person by id', async() => {
    const actor = await Actor.create({ name: 'jcvd', dob: '11-13-1970', pob: 'Brussels' });

    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({ name: 'Kurt Russel', dob: new Date('10-13-1962'), pob: 'Heaven' })
      .then(res => {
        const actorJSON = JSON.parse(JSON.stringify(actor));
        expect(res.body).toEqual({
          ...actorJSON,
          name: 'Kurt Russel', 
          dob: new Date('10-13-1962').toISOString(), 
          pob: 'Heaven' 
        });
      });
  });

  it('DELETES and actor', async() => {

    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          message: 'MOVIES exist!!!'
        });
      });
  });

});
