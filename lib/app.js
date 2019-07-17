const express = require('express');
const app = express();

// require routes
const studioRoutes = require('./routes/studioRoutes');


app.use(express.json());

//use routes
app.use('/api/v1/studios', studioRoutes);


// app.use('/api/v1/RESOURCE', require('./routes/resource'));

app.use(require('./middleware/not-found'));
app.use(require('./middleware/error'));

module.exports = app;
