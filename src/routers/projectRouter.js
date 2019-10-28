const express = require('express')
const router = new express.Router();

const Project = require('../models/Project');
const gridService = require('../services/gridService');

// GET THE MAIN PROJECTS PAGE
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({}).limit(4).sort({createdAt: -1})
    if(!projects) return res.status(404).send('No projects currently available');
  
    // count the number of projects in db
    const count = await Project.countDocuments();
    // pass in count and get back pagination html
    const linksHTML = gridService.getLinksBar(count, 'projects');

    projects.forEach((project) => {
      project.type = "projects"  // This property is added to help the handlebars file know it's the gridProject.hbs to serve rather than gridBlog.hbs
    })

    res.render('projects', {
      projects,
      count,
      linksHTML

    });
  } catch (e) {
    res.status(400).send(e.message);
  }
}); 

// ROUTE FOR GETTING THE SCREENSHOT IMAGE FOR PROJECT
router.get('/projects/:id/img', async (req, res) => {
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