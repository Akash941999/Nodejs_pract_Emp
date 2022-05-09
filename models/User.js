const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    max:255,
    min: 6

  },
  email: {
    type: String,
    required: true,
    max:255,
    min: 6
  },
  password: {
    type: String,
    required: true,
    max:255,
    min: 6
  },
  post: {
    type: String,
    required: true,
    max: 255,
    min: 2
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});


// export model user with UserSchema User is name of model
module.exports = mongoose.model("User", userSchema);



