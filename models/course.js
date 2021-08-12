import mongoose from 'mongoose';
import { v4 as uuid } from 'uuid';

const schema = new mongoose.Schema({
  _id: { type: String, default: uuid },
  name: String,
});

export default mongoose.model('course', schema);
