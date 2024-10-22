const Cycle = require('../models/cycle.model');
const Question = require('../models/question.model');

// Fetch the current question for a region 
exports.getQuestionForRegion = async (req, res) => {
  const { region } = req.params;
  try {
    const cycle = await Cycle.findOne({ region });
    const questionSet = await Question.findOne({ region });

    if (cycle && questionSet) {
      const currentQuestion = questionSet.questionSet[cycle.currentCycle];
      return res.status(200).json({ question: currentQuestion });
    } else {
      return res.status(404).json({ message: "Region not found" });
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// Insert question set for a region
exports.insertQuestionSet = async (req, res) => {
  const { region, questions } = req.body;

  if (!region || !questions || !Array.isArray(questions) || questions.length === 0) {
    return res.status(400).json({ message: "Invalid data: region and question set are required." });
  }

  try {
    // Check if the region already has a question set
    let questionSet = await Question.findOne({ region });

    if (questionSet) {
      return res.status(400).json({ message: "Question set for this region already exists." });
    }

    // Create new question set
    questionSet = new Question({
      region,
      questionSet: questions,
    });

    await questionSet.save();

    // Create initial cycle for the region if it doesn't exist
    let cycle = await Cycle.findOne({ region });
    if (!cycle) {
      cycle = new Cycle({
        region,
        currentCycle: 0,
        cycleDuration: 7,  // default 7 days
        lastCycleUpdate: Date.now(),
      });
      await cycle.save();
    }

    return res.status(201).json({ message: "Question set inserted successfully.", questionSet });
  } catch (err) {
   return res.status(500).json({ error: err.message });
  }
};
