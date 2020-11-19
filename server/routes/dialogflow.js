import express from 'express';
// const structjson = require('./structjson.js');
import dialogflow from 'dialogflow';
import uuid from 'uuid';
// const dialogflow = require('@google-cloud/dialogflow');
import config from '../config/dev.js';
// const config = require('../config/keys');

const router = express.Router();
const projectId = config.googleProjectID
const sessionId = config.dialogFlowSessionID
const languageCode = config.dialogFlowSessionLanguageCode

// // Create a new session
const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(projectId, sessionId);

// // 2 Routes
// // 1. Text Query Route
router.post('/textQuery', async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        // the quesry to sent to the dialogflow agent
        text: req.body.text,
        languageCode: languageCode,
      },
    },
  };

  // send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result)
})

// 2. Event Query Route
router.post('/eventQuery', async (req, res) => {
  const request = {
    session: sessionPath,
    queryInput: {
      event: {
        // the event to sent to the dialogflow agent
        name: req.body.event,
        languageCode: languageCode,
      },
    },
  };

  // send request and log result
  const responses = await sessionClient.detectIntent(request);
  console.log('Detected intent');
  const result = responses[0].queryResult;
  console.log(`  Query: ${result.queryText}`);
  console.log(`  Response: ${result.fulfillmentText}`);

  res.send(result)
})

export default router;
