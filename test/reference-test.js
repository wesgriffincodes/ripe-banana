// require('dotenv').config();

// const request = require('supertest');
// const app = require('../lib/app');
// const Meme = require('../lib/models/Meme');
// const mongoose = require('mongoose');
// const connect = require('../lib/utils/connect');


// describe('app routes', () => {
//   beforeAll(() => {
//     connect();
//   });
    
//   beforeEach(() => {
//     return mongoose.connection.dropDatabase();
//   });
    
//   afterAll(() => {
//     return mongoose.connection.close();
//   });

//   it('create a new meme', () => {
//     return request(app)
//       .post('/api/v1/memes')
//       .send({ 
//         top: 'boom', 
//         image: 'url', 
//         bottom: 'bing.com' 
//       })
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.any(String),
//           top: 'boom',
//           image: 'url',
//           bottom: 'bing.com',
//           __v: 0
//         });
//       });
//   });

//   it('gets all memes', async() => {
//     const meme = await Meme.create({  top: 'boom', image: 'url', bottom: 'bing.com' });

//     return request(app)
//       .get('/api/v1/memes')
//       .then(res => {
//         const memeJSON = JSON.parse(JSON.stringify(meme));
//         expect(res.body).toEqual([memeJSON]);
//       });
//   });

//   it('gets a meme by id', async() => {
//     const meme = await Meme.create({ top: 'boom yay', image: 'url again', bottom: 'bing.com' });

//     return request(app)
//       .get(`/api/v1/memes/${meme._id}`)
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.any(String),
//           top: 'boom yay',
//           image: 'url again',
//           bottom: 'bing.com',
//           __v: 0
//         });
//       });
//   });
    
//   it('update a meme', async() => {
//     const meme = await Meme.create({ 
//       top:'boom', 
//       image: 'url', 
//       bottom: 'bing.com' 
//     });

//     return request(app)
//       .put(`/api/v1/memes/${meme._id}`)
//       .send({ 
//         top: 'different', 
//         image: 'different url', 
//         bottom: 'different bing.com' 
//       })
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.any(String),
//           top: 'different',
//           image: 'different url',
//           bottom: 'different bing.com',
//           __v: 0,
//         });
//       });
//   });

//   it('deletes a meme', async() => {
//     const meme = await Meme.create({ 
//       top: 'boom', 
//       image: 'url', 
//       bottom: 'bing.com' 
//     });

//     return request(app)
//       .delete(`/api/v1/memes/${meme._id}`)
//       .then(res => {
//         expect(res.body).toEqual({
//           _id: expect.any(String),
//           top: 'boom',
//           image: 'url',
//           bottom: 'bing.com',
//           __v: 0
//         });
//       });
//   });

// });
