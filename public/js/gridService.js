  /*
      THE GRID SERVICE IS A LAYOUT SYSTEM FOR THE SITE'S  DISPLAY OF PROJECTS AND BLOGS LISTINGS.  THEY ARE UL LI'S.  BOTH BLOGS AND PROJECTS "THUMBS" ARE LISTED ON THE HOME PAGE AND EACH HAVE THEIR OWN PROJECTS.HBS AND BLOGS.HBS. PAGES. THOSE PAGES EMPLOY PAGINATION AND FILTERING/SORTING FUNCTIONALITY. GRIDSERVICE CENTRALISES THE CODE AND STYLES TO ACHIEVE THIS. 

      GRIDSERVICE.HBS - SERVER SIDE VIEW WITH TWO SUB PARTIALS,  GRIDBLOGS.HBS AND GRIDPROJECTS.HBS
      GRIDSERVICE.CSS - STYLES FOR ABOVE TEMPLATES 
      GRIDSERVICE.JS - CLIENT SIDE: PROVIDES ALL FUNCTIONALITY FOR INTERACTING WITH THE ELEMENTS WITHIN THE SERVICE UL
      WHICHGRID  - HELPER FUNCTION ON APP.JS WHICH APPLIES LOGIC TO DETERMINE WHETHER THE UL SHOULD DISPAY PROJECTS LISTS OR BLOGS LISTS - THAT IS, DISPLAY GRIDBLOGS.HBS OR GRIDPROJECTS.HBS SUBPARTIAL TEMPLATE
      GRIDSERVICE.JS -SERVICE FOLDER, SERVERSIDE -  SERVER SIDE UTILITY FILE
  */
  
 
const gridService = (() => { 
  // Establish if we're deaing with a 'blogs' or 'projects'
  const type = document.querySelector('ul.grid-service').dataset.type;

  if(type === 'projects') {

    // Get all ul.grid-service list items (thumbs) on the page..  if it's the home page bear in mind that this will include blogs list items as well as projects list items..
    const projectThumbs = document.querySelectorAll('ul.grid-service li')

    // Establish if it's the projects on the home page display or the projects page display
    if(document.querySelector('.content').dataset.page === "home") {

      // If we're  on the home page needs to filter out the blogs thumbs as they don't have mouseover overlays
      const thumbsArray = [...projectThumbs];   // convert to real js array for use of filter();
      const filteredThumbsArray = thumbsArray.filter((el) => {
        return el.parentElement.dataset.type === 'projects'
      });
      registerThumbOverlay(filteredThumbsArray)
    }else {
      // if you're on the projects page don't need to worry about filtering out any blogs thumbs so just go ahead and pass in the array of thumbs as is 
      registerThumbOverlay(projectThumbs)
    }
  }

  /* =============
    PROJECT GRID THUMBS ON MOUSEENTER SHOW OVERLAY OF DETAILS ABOUT PROJECT, REGISTER THE EVENT HANDLER HERE: 

   @PARAM:   el     array of HTMLElementObjects       The list istem to add the handler to
  ================ */
    // Takes array of list-items and applies mouseenter and mouseleave events as shown below.
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
            <img src="/projects/${query._id}/img" alt="${query.name}">
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
        query.date = new Date(query.createdAt).toDateString()
        htmlString += 
        `
        <li>
          <img src="/blogs/${query._id}/img" alt="${query.title}">    
          <div class="blogs-thumb-overlay">
            <p class="blogs-thumb-date">Posted: ${query.date}</p>
            <div class="thumb-center">
              <h1>${query.title} <hr></h1>
              <div><a href="/blogs/${query._id}">Read Article</a></div>
            </div>              
            <div class="blogs-thumb-tags"> 
        `
        query.tags.forEach((tag) => {
          htmlString += `<span><i class="fas fa-tags"></i>${tag.tag}</span>`
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
