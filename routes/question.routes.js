const express = require('express');
const router = express.Router();
const { getQuestionForRegion, insertQuestionSet } = require('../controllers/question.controller');

// Route to get the current question for a region
router.get('/question/:region', getQuestionForRegion);

// Route to insert a new question set for a region
router.post('/question', insertQuestionSet); 
module.exports = router;
