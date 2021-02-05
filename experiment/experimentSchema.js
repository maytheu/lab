const mongoose = require("mongoose");

const experimentSchema = mongoose.Schema({
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  tips: [String],
  img: String,
  properties: [String],
  precaution: String,
});

mongoose.model("experiments", experimentSchema);
