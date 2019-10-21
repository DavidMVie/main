const express = require('express')
const router = new express.Router();

const Project = require('../models/Project');
const auth = require('../middleware/auth');

// GET THE MAIN PROJECTS PAGE
router.get('/projects', async (req, res) => {
  const projects = await Project.find({})
  if(!projects) return res.status(404).send('No projects currently available')
  res.render('projects',{
    projects
  });
}); 


// ROUTE FOR GETTING THE SCREENSHOT IMAGE FOR PROJECT
router.get('/project/:id/img', async (req, res) => {
  try {
    const project =  await Project.findById({_id: req.params.id});
    res.set('Content-Type', 'image/png');
    res.send(project.screenshot)
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// ROUTE FOR A SPECIFIC PROJECTS PAGE
router.get('/projects/:id/project',  async (req, res) => {
  try {
    const project = await Project.findById({_id: req.params.id});
    //String of project tools xfer to an array
    project.toolsArray  = project.tools.split(",");
    project.featuresArray = project.features.split(',')
    res.render('project', {
      project
    })
  } catch (e) {
    res.status(400).send(e.message);
  }
})



module.exports = router;