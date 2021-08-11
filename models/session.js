import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  sessionId: String,
  courseId: String,
  totalModulesStudied: Number,
  averageScore: Number,
  timeStudied: Number,
});

export default mongoose.model('session', schema);
