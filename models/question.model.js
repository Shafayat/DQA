const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  region: { type: String, required: true, unique: true },  // unique per region
  questionSet: [{ type: String, required: true }],
});

module.exports = mongoose.model('Question', QuestionSchema);
