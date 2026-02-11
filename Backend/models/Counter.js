// models/Counter.js
import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // e.g. "SOFTWARE_2025"
  seq: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("Counter", CounterSchema);
