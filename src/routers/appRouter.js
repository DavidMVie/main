const path = require('path');
const express = require('express');

const Project = require('../models/Project');
const Blog = require('../models/Blog')
const router = new express.Router(); 

// Home Route / Landing Page
router.get('/', async (req, res) => {

  try {
    const prj = await Project.find({}).sort({createdAt: -1});
    const blogs = await Blog.find({}).limit(4);

    blogs.forEach((blog) => {
      blog.screenshot = '';
      blog.type = "blogs"
    })
    
    // get all but the featured one, then limit to last 4
    const projects = prj.filter(project => !project.featuredProject).splice(0,4);

    // Reference the featured one. Running filter twice??? look up a better way :/
    const featuredProject = prj.filter(project => project.featuredProject)

    if(featuredProject.length === 0) {
      throw new Error('Admin Error. Site must have 1 "Featured Project"')
    }
  
    if(featuredProject.length > 1) {
      throw new Error('Admin Error. Can\'t have more than 1 featured Project!')
    }
  
    // res.send(projectsList)  // json test to browser

    projects.forEach((project) => {
      project.type = 'projects'
    })
  
    res.render('home', {
      featuredProject: featuredProject[0],
      projects,  // PROBLEM IS THEY CAN'T BOTH BE CALLED DATA,  HOW TO DIFFERENTIATE????????? WORKING HERE !!!!!!!
      blogs
    });
  } catch (e) {
    res.status(400).send(e.message);
  }


});


module.exports = router;