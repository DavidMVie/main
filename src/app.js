const path = require('path');
require('./db/mongoose.connect.js')
const express = require('express');
const hbs = require('hbs');

const appRouter = require('./routers/appRouter');
const adminRouter = require('./routers/adminRouter');
const projectRouter = require('./routers/projectRouter');
const blogRouter = require('./routers/blogRouter');
const contactRouter = require('./routers/contactRouter');
const gridServiceRouter = require('./routers/gridServiceRouter');

const app = express(); 
app.use(express.json());
app.use(express.urlencoded({extended: false}))
app.use(express.static('public'));
app.set('view engine', 'hbs');

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

hbs.registerHelper('getDate', function(jsDate){
  var fDate = jsDate.toDateString()
  return fDate;
});

hbs.registerHelper('whichGrid', function(toRender) {

  switch (toRender) 
  {
    case 'blogs': 
    return 'gridBlogs'

    case 'projects': 
    return 'gridProjects'

    default:
      throw new Error('Unable to get grid')
  }
})



app.set('views', path.join(__dirname, 'views'))
app.use(appRouter);
app.use(adminRouter);
app.use(projectRouter);
app.use(blogRouter);
app.use(contactRouter);
app.use(gridServiceRouter);

const port = process.env.PORT;
app.listen(port,  () => {
  console.log('Ole cloth ears is listening on port ' + port)
})