import mongoose from 'mongoose';
// Interview.js
const interviewSchema = new mongoose.Schema({
  jobPosition: String,
  jobDescription: String,
  duration: Number,
  types: [String],
  questions: [String],
  createdAt: {
    type: Date,
    default: Date.now
  },
  
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});


export const Interview = mongoose.model('Interview', interviewSchema);

