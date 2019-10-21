const express = require('express');
const multer = require('multer');

const auth = require('../middleware/auth');
const AdminUser = require('../models/Admin');
const Blog = require('../models/Blog');
const Project = require('../models/Project')

const router = new express.Router();

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(png|jpg|jpeg)$/)){
      cb(new Error('Wrong file type, supports jpg/jpeg/png only'))
    }else {
      cb(undefined, true)
    }
  }
});

// LOG ADMIN USER IN
router.post('/admin/login', async (req, res) => {
  try {
    const adminUser = await AdminUser.findByCredentials(req.body.email, req.body.password);
    const token = await adminUser.getAuthToken();
    await adminUser.save();
    res.send({
      msg: 'Welcome back ' + adminUser.name + '.',
      token
    })
  } catch (e) {
    res.status(400).send(e.message);
  }

});

// POST A NEW PROJECT
router.post('/projects', upload.single('screenshot'), auth, async (req, res) => {
  try {
    const project = new Project({
      name: req.body.name,
      shortDescription: req.body.shortDescription,
      longDescription: req.body.longDescription,
      screenshot: req.file.buffer,
      tools: req.body.tools,
      features: req.body.features,
      githubLink: req.body.githubLink,
      liveSiteLink: req.body.liveSiteLink
    });
  
    await project.save();
    res.send({msg: project.name + ' succesfully saved!'}); 
  } catch (e) {
    res.status(400).send(e.message);
  }

});

// POST A NEW BLOG THUMB COVER PIC
router.post('/blogs/:id/img', upload.single('thumbPic'), auth, async (req, res) => {
  try {
    const blog  = await Blog.findById({_id: req.params.id});
    if(!blog) {
      res.status(404).send();
    }
 
    blog.thumbPic = req.file.buffer;
    console.log(blog)
    await blog.save();
    res.send()
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// CHANGE A FEATURED PROJECT
router.get('/projects/:id/featured', auth, async (req, res) => {
  try {
    // get all the projects out of the database 
    const projects = await Project.find({});
    console.log('PROOOOOOJECTS ', projects)
    // Loop and clear any featured projects
    projects.forEach((project) => {
      if(project.featuredProject) {
        project.featuredProject = false;
      }
    })
    // REVISE THIS - SHOULD BE BETTER TO RUN AN UPDATE AND SET CALL TO DB
    const project = await Project.find({_id: req.params.id})
    if(!project) {
      return res.status(404).send({msg: "Project Does Not Exist"})
    }
    project.featuredProject = true;
    await project.save();
    res.send({msg: 'Successfully set as "Featured Project"'})
  } catch (e) {
    res.status(400).send(e.message);
  }
})


module.exports = router;