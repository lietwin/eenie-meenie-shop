const express = require('express');
const wagner = require('wagner-core');
const models = require('./models');
const api = require('./api');

models(wagner);

const app = express();

app.use('/api/v1', api(wagner));
app.listen(3000);
console.log('app listening to port 3000...');
