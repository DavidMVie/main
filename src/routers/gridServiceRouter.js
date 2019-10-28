const express = require('express');

const router = new express.Router();
const Project = require('../models/Project');
const Blog = require('../models/Blog')
const gridService = require('../services/gridService')

// Filtering and Pagination
router.get('/gridService', async (req, res) => {

  console.log('THE __ QUERY ', req.query)
  const sortBy = {}
  var skip = 0;
  
  const type = req.query.type; // Is the type of request 'blogs' grid or 'projects' grid.
 try {
      // Pagination
   if(req.query.pg) {
     let pageNumber = req.query.pg * 1 //convert to number;
     skip = (pageNumber - 1) * 4;
   }

   // Hard coded to createdAt, so for now can only sort on that field. 
   if(req.query.sortBy) {
     sortBy['createdAt'] = req.query.sortBy === 'desc' ? -1 : 1;
   }

   if(req.query.show === 'all') {

     if(req.query.type === 'projects') {
        let query = await Project.find({})
         .limit(4)
         .sort(sortBy)
         .skip(skip)
         
        let count = await Project.countDocuments({})

        var linksHTML =  gridService.getLinksBar(count, type);
        console.log('linksHTML ', linksHTML)
        query.forEach((project) => {
          project.screenshot = '';  // don't need to send all this binary down
        })

        
        return res.send({
          query,
          count,
          linksHTML,
          type
        });

     } else if (req.query.type === 'blogs') {
      let query = await Blog.find({})
      .limit(4)
      .sort(sortBy)
      .skip(skip)
      
     let count = await Blog.countDocuments({})

     let linksHTML = gridService.getLinksBar(count, type);
     query.forEach((blog) => {
      blog.thumbPic = '';  // don't need to send all this binary down
      // blog.type = 'blogs'  // templates need to be told whether they're rendering blogs or projects li thumbs,  this is how that's done.
     })

     return res.send({
       query,
       count,
       linksHTML,
       type
     });
     }
       


   } else if(req.query.show === 'completed') {
     console.log('SKIP ', skip, 'completed running');
     let query = await Project.find({})
       .where('progress')
       .equals(100)
       .limit(4)
       .sort(sortBy)
       .skip(skip)

     let count = await Project.countDocuments({progress: 100})

     var linksHTML =  gridService.getLinksBar(count, type);

     query.forEach((project) => {
      project.screenshot = '';  // don't need to send all the binary down
      // project.type = 'projects'
     })

     return res.send({
       query,
       count,
       linksHTML,
       type
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
  
     var linksHTML =  gridService.getLinksBar(count, type);

     query.forEach((project) => {
      project.screenshot = '';  // don't need to send all this binary down
      // project.type = req.query.type
     })
     return res.send({
       query,
       count,
       linksHTML,
       type
     });
   }else{
      // it must be a tag,  get all tags from database and make sure the tag being searched for exists

      // All  (blog or projectS)
      // completed (projects)
      // incomplete (projects);
      // nodeJS, gerneral etc
      // Javsacript  basically any one of the tags that are allowed,  so perhaps think about validating vs a tags model or something of that sort?
   }

 } catch (e) {
   res.status(400).send(e.message)
 }

}); 



module.exports = router;