const { Router } = require('express');
const Actor = require('../models/Actor');
const Film = require('../models/Film');

module.exports = Router()

  .post('/', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;

    Actor
      .create({ name, dob, pob })
      .then(actor => res.send(actor))
      .catch(next);
  })

  .get('/', (req, res, next) => {
    Actor
      .find()
      .select({ _id: true, name: true })
      .then(actors => res.send(actors))
      .catch(next);
  })

  .get('/:id', (req, res, next) => {
    Promise.all([
      Actor.findById(req.params.id),
      Film.find({ actor: req.params.id })
    ])
      .then(([actor, films]) => res.send({ ...actor.toJSON(), films }))
      .catch(next);
  })

  .put('/:id', (req, res, next) => {
    const {
      name,
      dob,
      pob
    } = req.body;
    
    Actor
      .findByIdAndUpdate(req.params.id, { name, dob, pob }, { new: true })
      .then(updatedActor => res.send(updatedActor))
      .catch(next);
  })
;
