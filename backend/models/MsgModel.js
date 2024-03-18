const mongoose = require("mongoose");

const msgSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, trim: true },
  chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
  timestamp: { type: Date, default: Date.now },
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    deleteAt: {
      type: Date,
      default: null
    },

    isDeleted:{
      type:Boolean,
      default:false
    },
    
  type: {
    type: String,
    enum: ["text", "image", "video", "audio", "document", "location", "contact"],
    default: "text",
  },
  imageUrl: { type: String },
  videoUrl: { type: String },
  audioUrl: { type: String },
  documentUrl: { type: String },
});

module.exports = mongoose.model("Msg", msgSchema);
