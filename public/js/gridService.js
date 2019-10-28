  /* HOME PAGE NEEDS GRID SYSTEM FOR LAYOUT OF THUMBS,  AS DOES PROJECTS PAGE FOR PROJECT THUMBS AND BLOGS PAGE FOR ITS LIST OF ALL BLOGS.  THE GRIDSERVICE PROVIDES A WAY TO CENTRALIZE THIS CODE AND ITS STYLES 
    IT INCLUDES VIEW TEMPLATE GRIDSERVICE.HBS,  ALONG WITH TWO SUB TEMPLATE PARTIALS - GRIDBLOGS.HBS / GRIDPROJECTS.HBS
    GRIDSERVICE.CSS PROVIDES ALL THE UL'S STYLINGS,  
    GRIDSERVICE.JS PROVIDES ALL THE JS FUNCTIONALITY FOR INTERACTING WITH ELEMENTS OF THE UL.
    WHICHGRID IS A HELPER FUNCTION ADDED TO APP.JS AND USED TO TAKE A STRING, "PROJECTS" OR "BLOGS",  AND THEN RETURN THE CORRECT PARTIAL, BE THAT GRIDBLOGS.HBS OR GRIDPROJECTS.HBS.
  */
 
const gridService = (() => { 
  // Establish if we're deaing with a 'blogs' or 'projects' service request. 
  const type = document.querySelector('ul.grid-service').dataset.type;
  /* =============
  PROJECT GRID THUMBS ON MOUSEENTER SHOW OVELAY OF DETAILS ABOUT PROJECT, REGISTER THE EVENT HANDLER: 

  @PARAM:   el     array of HTMLElementObjects       The list istem to add the handler to
  ================ */

  if(type === 'projects') {
    // Get an array like obj back with all list items to apply overlay event hander to
    const projectThumbs = document.querySelectorAll('ul.grid-service li')
    // Pass that array to a function that will loop over each item and add both mouseenter and leave events.
    registerThumbOverlay(projectThumbs) ;
  }

  function registerThumbOverlay (el) {
    el.forEach( (thumb) => {
      thumb.addEventListener('mouseenter', (e) => {
        thumb.querySelector('.prj-thumb-overlay').style.display = "block"   
      })
  
      thumb.addEventListener('mouseleave', (e) => {
        thumb.querySelector('.prj-thumb-overlay').style.display = "none"
      });
    });
  }

  /* PAGINATION LINKS ABOVE GRID
  =============================== */
  /*
    User clicks one of the pagination numbers li's, requesting a new page of results

    @param      pageNumber     INT      Page of results the user wants. 
    @PARAM      type           String   Page from which colection?  'projects'|'blogs'
  */
  const getPage = (pageNumber, type) => {

    const xhr = new XMLHttpRequest(); 

    xhr.onload = function() {
      const result = JSON.parse(xhr.responseText)
      console.log(result)
      // re-render the ul grid
      getNewThumbList(result.query, type);
      // re-render the linksBar
      const linksBarCount = document.querySelector('.links-bar > span');
      linksBarCount.innerText = 'Results: ' + result.count

      const linksBarLinks = document.querySelector('.links-bar > ul');
      linksBarLinks.innerHTML = 'Pages: ' + result.linksHTML;

      // GEt all the links 
      const links = document.querySelectorAll('.links-bar > ul li');

      links.forEach((link) => {
        if(link.classList.contains('current')) {
          link.classList.remove('current');
        }
      });
      links[pageNumber - 1].classList.add('current');

    }

    xhr.open('GET', `/gridService?pg=${pageNumber}&show=${showStatus.value}&sortBy=${sortBy.value}&type=${type}`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send();
  }

  const getNewThumbList = (json, type) => {
    console.log(type)
    let htmlString = ``;
    if(type === 'projects') {
      json.forEach((query) => {
      
        htmlString +=
        `
        <li>
          <i class="fas fa-info-circle" title="Click for more details"></i>
          <a href="">
            <img src="http://localhost:3000/projects/${query._id}/img" alt="${query.name}">
          </a>
          <div class="prj-thumb-overlay">
            <a href="/projects/${query._id}/project">
              <h2>${query.name}</h2>
              <hr />
              <p>${query.shortDescription}</p>
              <p><span class="using">Built With:</span> ${query.tools}</p>
            </a>
          </div>
        </li>
        `
      })
      
        const parent = document.querySelector('ul.grid-service');
        parent.innerHTML  = htmlString;
        const projectThumbs = document.querySelectorAll('ul.grid-service li')
        registerThumbOverlay(projectThumbs)
  
    } else if (type === 'blogs') {
      json.forEach((query) => {
        htmlString += 
        `
        <li>
          <img src="http://localhost:3000/blogs/${query._id}/img" alt="${query.title}">    
          <div class="blogs-thumb-overlay">
            <p class="blogs-thumb-date">Posted: {{getDate this.createdAt}}</p>
            <div class="thumb-center">
              <h1>${query.title} <hr></h1>
              <div><a href="/blogs/${query._id}">Read Article</a></div>
            </div>              
            <div class="blogs-thumb-tags"> 
        `
        query.tags.forEach((tag) => {
          htmlString += `<span><i class="fas fa-tags"></i>${tag}</span>`
        })

        htmlString += `
            </div>   
          </div>        
        </li>
        `        
      })
      const parent = document.querySelector('ul.grid-service');
      parent.innerHTML  = htmlString;
    }
  }


  const exports = {
      getPage
  }


  // REGISTER EVENT HANDLERS 

   // Sets the current class on page load to pag no 1
   if(document.querySelector('.links-bar ul li')) {
    document.querySelectorAll('.links-bar ul li')[0].classList.add('current')
  }

   // Reference to the select dropdown of what type of project/blog to filter.
  const showStatus = document.querySelector('#showStatus') || null;

   // Reference to the sortBy Select drop down which sorts by CreatedAt date in ASC or DESC order:
  const sortBy = document.querySelector('#sortBy') || null;

  if(showStatus) {  // Register event to fire when the select filter option is changed. 
    showStatus.onchange = function (event) {
      changeFilters(event.target.value, sortBy.value, type);
    }
  }

  if(sortBy) {  // Register event to fire when select option is changed. 
    sortBy.onchange = function(event) {
      changeFilters(showStatus.value, event.target.value, type);
    }
  }  

  const changeFilters = (status, sort, type) => {
    // fetch request to return with the url encoded

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      console.log(xhr.responseText) // filters/sorted/paginated data returned
      // Now need to re-render the container which is a manual task I think
      const result = JSON.parse(xhr.responseText);
      // function call to build the html
      getNewThumbList(result.query, type);
      // re-render the linksBar
      const linksBarCount = document.querySelector('.links-bar > span');
      linksBarCount.innerText = 'Results: ' + result.count

      const linksBarLinks = document.querySelector('.links-bar > ul');
      linksBarLinks.innerHTML = 'Pages: ' + result.linksHTML;
    }

    xhr.open('GET', `/gridService?show=${status}&sortBy=${sort}&type=${type}`, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send()
  }

  return exports;
})()
