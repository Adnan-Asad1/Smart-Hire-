// utils/getNextSequence.js
import Counter from "../models/Counter.js";

/**
 * Atomically increments and returns next sequence for the given key.
 * Example key: "SOFTWARE_2025"
 */
export const getNextSequence = async (key) => {
  const updated = await Counter.findOneAndUpdate(
    { key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return updated.seq;
};
