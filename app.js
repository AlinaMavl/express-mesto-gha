const express = require('express');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/mestodb')
  .then(() => {
    console.log('MongoDB connected');
  });

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '656e348bf803cd4df1e240a9',
  };
  next();
});

app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.use('*', (req, res) => res.status(404).send({ message: 'Not implemented' }));

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
