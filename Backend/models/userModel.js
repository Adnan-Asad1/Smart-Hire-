import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    hrRole: {
        type: String,
        required: true,
    },
    experience: {
        type: String,   // 🔑 String instead of Number
        required: true,
    },
    skills: {
        type: [String], // array of strings
        required: true,
    },  credits: {
        type: Number,
        default: 3,   // ✅ by default har naya user ke 3 credits honge
    },
    resetToken: String,
    resetTokenExpiry: Date,
}, { timestamps: true })

export const User = mongoose.model("User", userSchema)
