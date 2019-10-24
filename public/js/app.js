// Toggling The Header  Nav Menu Button on Mob Display Sizes
const onMenu = () => {
  const menuSideBar = document.querySelector('.menu-side-bar') || null;
  if(!menuSideBar) {
    // Create the element
    const menuSideBar = document.createElement('nav');
    menuSideBar.className = 'menu-side-bar';
    document.querySelector('body').appendChild(menuSideBar);
    menuSideBar.innerHTML = `
    <nav class="mob-nav">
      <li><a href="/">Home</a></li>
      <li><a href="/projects">Projects</a></li>
      <li><a href="/blogs">Blogs</a></li>
      <li><a href="/contact">Contact</a></li>        
    </nav>
    <div class="gradient-bar"></div>
    `

    setTimeout( () => {
      document.querySelector('.menu-side-bar').style.left= "0vw";

      }, 0);  // Defer execution till everything else is loaded.

  }else {

    menuSideBar.style.left= "-40vw"
    menuSideBar.style.transition = "left .15s ease"
    document.querySelector('header .fas.fa-bars').setAttribute('disabled', true)
    setTimeout( () => {
      menuSideBar.parentElement.removeChild(menuSideBar);
      document.querySelector('header .fas.fa-bars').setAttribute('disabled', false)
    }, 150)
  }
};


  // On Load Event Listeners 
  document.querySelector('header .fas.fa-bars').addEventListener('click', (e) => {
    onMenu();
  });  

  // Home Page Project click handlers;
  const projectThumbs = document.querySelectorAll('li.prj-thumb-list')
  registerThumbOverlay(projectThumbs)


  /* Set the event handler on the thumbs so the overlay appears on mouse enter and disapears on mouseleave  */
  /* 
   @PARAM:   el     array of HTMLElementObjects       The list istem to add the handler to
  */
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


    // Projects / Blogs Page - Detecting Select Change - FILTERING
  const showStatus = document.querySelector('#showStatus') || null

  if(showStatus) {
    // If the user changes filter to view all, completed or incompleted projects.
    showStatus.onchange = function (event) {
      changeFilters(event.target.value, sortBy.value);
    }
  }

  // If the user changes the mode of sortBy eg, createdAt:-1 (Desc)
  const sortBy = document.querySelector('#sortBy') || null; 

  if(sortBy) {
    sortBy.onchange = function(event) {
      changeFilters(showStatus.value, event.target.value);
    }
  }

  const changeFilters = (status, sort) => {
    // fetch request to return with the url encoded

    const xhr = new XMLHttpRequest();
    xhr.onload = function() {
      console.log(xhr.responseText) // filters/sorted/paginated data returned
      // Now need to rerender the container which is a manual task I think
      const result = JSON.parse(xhr.responseText);
      // function call to build the html
      getNewThumbList(result.query);
      // re-render the linksBar
      const linksBarCount = document.querySelector('.links-bar > span');
      linksBarCount.innerText = 'Results: ' + result.count

      const linksBarLinks = document.querySelector('.links-bar > ul');
      linksBarLinks.innerHTML = 'Pages: ' + result.linksHTML;
    }

    xhr.open('GET', `/projects/list?show=${status}&sortBy=${sort}`, true)
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send()
  }

  const getNewThumbList = (json) => {

    let htmlString = ``
    json.forEach((project) => {
      htmlString +=
     `
      <li class="prj-thumb-list">
        <i class="fas fa-info-circle" title="Click for more details"></i>
        <a href="">
          <img src="http://localhost:3000/project/${project._id}/img" alt="${project.name}">
        </a>
        <div class="prj-thumb-overlay">
          <a href="/projects/${project._id}/project">
            <h2>${project.name}</h2>
            <hr />
            <p>${project.shortDescription}</p>
            <p><span class="using">Built With:</span> ${project.tools}</p>
          </a>
        </div>
      </li>
      `
    })
    
     const parent = document.querySelector('#projectsList');
     parent.innerHTML  = htmlString;
     const projectThumbs = document.querySelectorAll('li.prj-thumb-list')
     registerThumbOverlay(projectThumbs)

  }

  const getPage = (pageNumber) => {

    const xhr = new XMLHttpRequest(); 

    xhr.onload = function() {
      const result = JSON.parse(xhr.responseText)

      getNewThumbList(result.query);
      // re-render the linksBar
      const linksBarCount = document.querySelector('.links-bar > span');
      linksBarCount.innerText = 'Results: ' + result.count

      const linksBarLinks = document.querySelector('.links-bar > ul');
      linksBarLinks.innerHTML = 'Pages: ' + result.linksHTML;

      // GEt all the links 
      const links = document.querySelectorAll('.links-bar > ul li');
      console.log("LINKS", links)
      links.forEach((link) => {
        if(link.classList.contains('current')) {
          link.classList.remove('current');
        }
      });
      links[pageNumber - 1].classList.add('current');
  


    }

    xhr.open('GET', `/projects/list?pg=${pageNumber}&show=${showStatus.value}&sortBy=${sortBy.value}`, true);

    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    xhr.send();
  }


  if(document.querySelector('.links-bar ul li')) {
    document.querySelectorAll('.links-bar ul li')[0].classList.add('current')
  }