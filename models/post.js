const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  text: { type: String, required: true, maxLength: 100 },  
  date: { type: String, required: true, maxLength: 100 },
  user: { type: Schema.Types.ObjectId, ref: 'User' }, // Assuming Post is another model
});

// Virtual for user's URL
PostSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("Post", PostSchema);
