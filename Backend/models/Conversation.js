// models/Conversation.js
import mongoose from "mongoose";

const conversationEntrySchema = new mongoose.Schema({
  time: {
    type: String, // e.g., "03:15"
    required: true,
  },
  userText: {
    type: String,
    required: true,
  },
  aiText: {
    type: String,
    required: true,
  },
});

const conversationSchema = new mongoose.Schema({
  interviewId: {
    type: String, // sessionId from frontend
    required: true,
    index: true
  },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
  },
  conversation: [conversationEntrySchema], // ⬅️ stores sequential messages
  
},{ timestamps: true });

export const Conversation = mongoose.model("Conversation", conversationSchema);
