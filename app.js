const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');
const app = express();

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(express.json());
app.use(helmet);

app.use((req, res, next) => {
  req.user = {
    _id: '653ce5a0036040cf1f707a06'
  };

  next();
});

app.use(router);

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`);
});