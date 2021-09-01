const express = require('express');
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');


const DB_URL = process.env.DB_URL;
const PORT = process.env.PORT || 8080;
mongoose.connect(DB_URL, (err) => {
  if (err) {
    console.log('Database connection error');
  } else {
    console.log('Database connection open');
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  }
});
