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

  // Apply Event Handler To Each
  projectThumbs.forEach( (thumb) => {
    thumb.addEventListener('mouseenter', (e) => {
      thumb.querySelector('.prj-thumb-overlay').style.display = "block"   
    })

    thumb.addEventListener('mouseleave', (e) => {
      thumb.querySelector('.prj-thumb-overlay').style.display = "none"
    });
  })
  
