const express = require('express')
const router = new express.Router();

const Project = require('../models/Project');
const auth = require('../middleware/auth');
const filterService = require('../services/filterService');

// GET THE MAIN PROJECTS PAGE
router.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find({}).limit(4).sort({createdAt: -1})
    if(!projects) return res.status(404).send('No projects currently available');
  
    const count = await Project.countDocuments();
    const linksHTML = filterService.getLinksBar(count);

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



// Filtering and Pagination
router.get('/projects/list', async (req, res) => {

   const sortBy = {}
   var skip = 0;

  try {
       // Pagination
    if(req.query.pg) {
      let pageNumber = req.query.pg * 1 //convert to number;
      console.log('PAGE NUMBER ', pageNumber);
      skip = (pageNumber - 1) * 4;
    }

    // Hard coded to createdAt, so for now can only sort on that field. 
    if(req.query.sortBy) {
      sortBy['createdAt'] = req.query.sortBy === 'desc' ? -1 : 1;
      console.log('SortBY ', sortBy)
    }

    if(req.query.show === 'all') {
      console.log('SKIP ', skip, 'all running')
      let query = await Project.find({})
          .limit(4)
          .sort(sortBy)
          .skip(skip)
          
      let count = await Project.countDocuments({})

      let linksHTML = filterService.getLinksBar(count);
      query.forEach((item) => {
        item.screenshot = '';  // don't need to send all this binary down
        item.type = 'project'
      })
      return res.send({
        query,
        count,
        linksHTML
      });

    }else if(req.query.show === 'completed') {
      console.log('SKIP ', skip, 'completed running');
      let query = await Project.find({})
        .where('progress')
        .equals(100)
        .limit(4)
        .sort(sortBy)
        .skip(skip)

      let count = await Project.countDocuments({progress: 100})

      let linksHTML = filterService.getLinksBar(count);
      console.log('QUUUUUEEEEERRRRRYYYY', query)

      query.forEach((item) => {
        item.screenshot = '';  // don't need to send all this binary down
      })

      return res.send({
        query,
        count,
        linksHTML
      });

    }else if(req.query.show === 'incomplete') {
      console.log('SKIP ', skip, 'incomplete running')
      let query = await Project.find({})
        .where('progress')
        .lt(100)
        .limit(4)
        .sort(sortBy)
        .skip(skip)

      let count = await Project.countDocuments({progress: {$lt: 100}})

      let linksHTML = filterService.getLinksBar(count);

      query.forEach((item) => {
        item.screenshot = '';  // don't need to send all this binary down
      })
      return res.send({
        query,
        count,
        linksHTML
      });
    }

  } catch (e) {
    res.status(400).send(e)
  }

}); 




module.exports = router;