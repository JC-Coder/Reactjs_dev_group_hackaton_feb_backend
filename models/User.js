const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    uniqueId: {
      type: String,
      unique: [true, "User with this id already exist"],
    },
    lastMusicRequestTime: {
      type: String,
    },
    nextMusicRequestTime: String
  },
  { minimize: false, timestamps: true }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
