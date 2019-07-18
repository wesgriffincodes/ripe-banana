const express = require('express');
const app = express();

// require routes
const studioRoutes = require('./routes/studioRoutes');
const actorRoutes = require('./routes/actorRoutes');


app.use(express.json());

//use routes
app.use('/api/v1/studios', studioRoutes);
app.use('/api/v1/actors', actorRoutes);


// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
