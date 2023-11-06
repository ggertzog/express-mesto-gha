const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const router = require('./routes');
const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { signinValidate, signupValidate } = require('./middlewares/requestValidation');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

const app = express();

app.use(express.json());
app.use(helmet());

// app.use((req, res, next) => {
//   req.user = {
//     _id: '653ce5a0036040cf1f707a06'
//   };

//   next();
// });

app.post('/signin', signinValidate, login);
app.post('/signup', signupValidate, createUser);

app.use(auth);
app.use(router);

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'На сервере произошла ошибка'
      : message
  });
  next();
});

app.listen(PORT);