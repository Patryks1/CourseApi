import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const schema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  courseId: { type: String, ref: 'course' },
  totalModulesStudied: Number,
  averageScore: Number,
  timeStudied: Number,
});

export default mongoose.model('session', schema);
