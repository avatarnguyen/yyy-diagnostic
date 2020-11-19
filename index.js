import express from 'express';
import cors from 'cors';
// const path = require("path");
import path from 'path';
import bodyParser from 'body-parser';
import dialogflowRoutes from './server/routes/dialogflow.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

const app = express();
dotenv.config();


// const config = require("./server/config/keys");
// const mongoose = require("mongoose");
// mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => console.log('MongoDB Connected...'))
//   .catch(err => console.log(err));
// app.get('/', function(req, res) {
//   res.send("Hello World");
// });


app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use('/api/dialogflow', dialogflowRoutes);

app.get("/", (req, res) => {
  res.send("Hello to Diagnostic Tool Backend");
});

// Serve static assets if in production
// if (process.env.NODE_ENV === "production") {

//   // Set static folder
//   app.use(express.static("client/build"));

//   // index.html for all page routes
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
//   });
// }


// const CONNECTION_URL = process.env.CONNECTION_URL;
const PORT = process.env.PORT || 8000;

// mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
//   .then(() => app.listen(PORT, () => console.log(`Server runnint on port: ${PORT}`)))
//   .catch((error) => console.log(error.message));

// mongoose.set('useFindAndModify', false);
app.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`)
});