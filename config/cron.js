const cron = require('node-cron');
const moment = require('moment-timezone');
const Cycle = require('../models/cycle.model');
const Question = require('../models/question.model');

// Define cron job for updating question based on region's cycle
cron.schedule('0 19 * * 1', async () => {  // Runs every Monday at 7 PM SGT
  try {
    const cycles = await Cycle.find();
    for (const cycle of cycles) {
      const region = cycle.region;
      const questionSet = await Question.findOne({ region });

      if (questionSet) {
        cycle.currentCycle = (cycle.currentCycle + 1) % questionSet.questionSet.length;
        cycle.lastCycleUpdate = moment().tz("Asia/Singapore").toDate();
        await cycle.save();
      }
    }
    console.log("Questions updated for all regions.");
  } catch (err) {
    console.error(err.message);
  }
});
