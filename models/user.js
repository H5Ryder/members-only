const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: { type: String, required: true, maxLength: 100 },
  lastName: { type: String, required: true, maxLength: 100 },
  username: { type: String, required: true, maxLength: 100 },
  hash: { type: String, required: true },
  isMember: { type: Boolean, default: false },
  isAdmin: { type: Boolean, default: false },
});

// Virtual for user's URL
UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
