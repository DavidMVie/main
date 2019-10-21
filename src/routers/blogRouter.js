const path = require('path');
const express = require('express');
const hbs = require('hbs');
const Blog = require('../models/Blog');
const router = new express.Router(); 

hbs.registerHelper('getDate', function(jsDate){
  var fDate = jsDate.toDateString()
  return fDate;
});


// RETURN THE MAIN BLOGS PAGE 
router.get('/blogs', async (req, res) => {
  try {
    const blogs = await Blog.find({})
    if(!blogs) {
      return res.status(404).send();
    }
    blogs.forEach((blog) => {
       blog.thumbPic = ''  // This means an empty buffer is sent back, couldn't find the way to delete the whole things, forEach didn't work,  but doing this means the huge binary data is not sent at least.
       // split the tags string into an array
    });
    // res.send(blogs); // Test the json sent back
    res.render('blogs', {
      blogs
    });
  } catch (e) {
    res.status(400).send(e.message);
  }
})

// RETURN AN INDIVIDUAL BLOG PAGE
router.get('/blogs/:id', async (req, res) => {
  try {
    const blog = await Blog.findById({_id: req.params.id})
    // res.send(blog) // test json sent back
    res.render('blog', {
      blog
    })
  } catch (e) {
    res.status(400).send(e.message);
  }
});

// RETURN THE THUMB PIC FOR THE MAIN BLOGS PAGE
router.get('/blogs/:id/img', async (req, res) => {
  try {
    const blog = await Blog.findById({_id: req.params.id});
    if(!blog) {
      return res.status(404).send();
    }
    res.set("Content-Type", "image/jpg");
    res.send(blog.thumbPic)
  } catch (e) {
    res.status(400).send(e.message);
  }
});

module.exports = router;