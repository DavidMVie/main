const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },  
  screenshot: {
    type: Buffer,
    required: true
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true
  },

  longDescription: {
    type: String,

    required: true,
    trim: true
  },
  tools: {
    type: String,
    required: true
  },
  features: {
    type: String,
    required: true
  },
  githubLink: {
    type: String,
    trim: true
  },
  liveSiteLink: {
    type: String,
    default: "",
    trim: true
  },
  featuredProject: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number, /* % of completion */
    default: 0
  },
  ETA: {
    type: Date  /* Estimated date of completion */
  },
  buildTime: {
    type: Number,
    default: 0
  },
  progressStatement: {
    type: String,
  }
},{
  timestamps: true
});

projectSchema.methods.toJSON = function() {
   const projectObj = this.toObject();
   delete projectObj.picture;
   console.log(projectObj.picture)
   return projectObj
} // Trying to prevent sending back the binary as it's some size!

const Project = mongoose.model('Projects', projectSchema);

module.exports = Project;