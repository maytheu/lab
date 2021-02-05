const mongoose = require("mongoose");

const topicSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  topic: { type: String, required: true, unique: 1 },
});

mongoose.model("topics", topicSchema);
