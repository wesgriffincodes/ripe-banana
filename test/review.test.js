// require('dotenv').config();

// const request = require('supertest');
// const app = require('../lib/app');
// const connect = require('../lib/utils/connect');
// const mongoose = require('mongoose');
// const Review = require('../lib/models/Review');
// const Reviewer = require('../lib/models/Reviewer');
// const Film = require('../lib/models/Film');



// describe('film routes', () => {
//   beforeAll(() => {
//     connect();
//   });

    
//   beforeEach(() => {
//     return mongoose.connection.dropDatabase();
//   });

//   let reviewer = null;
//   let film = null;
//   beforeEach(async() => {
//     reviewer = JSON.parse(JSON.stringify(await Reviewer.create({ name: 'bob' })));
//     film = JSON.parse(JSON.stringify(await Film.create({ title: 'Captain Ron', studio: studio._id, released: 1993, cast: [{ actor: actor._id, role: 'Captain' }] })));
//   });


//   afterAll(() => {
//     return mongoose.connection.close();
//   });

// it('creates a review', () => {
//     return request(app)
//     .post('/api/v1/films')
//     .send({ rating: 3, reviewer: reviewer._id, review: 'some text', film: film._id, createdAt: })
// })

// });
