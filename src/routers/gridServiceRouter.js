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
     sortBy['createdAt'] = req.query.sortBy === 'Desc' ? -1 : 1;
   }

   if(req.query.show === 'All') {

     if(req.query.type === 'projects') {
 
        let query = await Project.find({})
         .limit(4)
         .sort(sortBy)
         .skip(skip)
         
        let count = await Project.countDocuments({})

        var linksHTML =  gridService.getLinksBar(count, type);
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
      blog.createdAt =  blog.createdAt.toDateString()
     })
     
     return res.send({
       query,
       count,
       linksHTML,
       type
     });
     }
       


   } else if(req.query.show === 'Completed') {
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

   }else if(req.query.show === 'Incomplete') {
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
     console.log('the other one!')
      console.log('the req.query.show', req.query.show)
     
     let query = await Blog.find({'tags.tag': req.query.show})
     .limit(4)
     .sort(sortBy)
     .skip(skip)
     
    let count = await Blog.countDocuments({'tags.tag': req.query.show})

    let linksHTML = gridService.getLinksBar(count, type);
    query.forEach((blog) => {
     blog.thumbPic = '';  // don't need to send all this binary down
     blog.createdAt =  blog.createdAt.toDateString()
    })
    console.log('queeeeeeree ', query)
    return res.send({
      query,
      count,
      linksHTML,
      type
    });
  }


   

 } catch (e) {
   res.status(400).send(e.message)
 }

}); 



module.exports = router;