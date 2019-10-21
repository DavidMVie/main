const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/vie', {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
  if(err) {console.log(err)}
});