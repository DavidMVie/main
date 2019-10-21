const mongoose = require('mongoose');

const blogSchema =  new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  htmlContent: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  tags: {
    type: Array,
    trim: true
  },
  thumbPic: {
    type: Buffer
  },
  featuredBlog: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

blogSchema.methods.toJSON = function(){
  blogObj = this.toObject();
  delete blogObj.thumbPic;
  return blogObj;
}

const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;