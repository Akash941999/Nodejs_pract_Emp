const mongoose = require("mongoose");

const empSchema = mongoose.Schema({
    name: {
      type: String,
      required: true,
      max:255,
      min: 2
    },
    department: {
      type: String,
      required: true,
      max:255,
      min: 2
    },
    salary: {
      type: String,
      required: true,
      max:255,
      min: 3
    },
    post: {
        type: String,
        required: true,
        max: 255,
        min: 2
    },
    employeeImage: { 
      type: String, 
      required: true 
    },
    createdAt: {
      type: Date,
      default: Date.now()
    }
  });

  module.exports = mongoose.model("user", empSchema);

  