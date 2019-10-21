"use strict";

const funky = (function() {

  /* Modal box 
    @Param:    cl    String    className for individual styling of each modal inst
    @Param:    pos   Object    params for Center Element x and y offsets {x: offset horizontal INT, y: offset vertical INT}
    @Param:    overlay Object  See overlay function
    @Returns   reference to the Modal HTMLElement
  */
  const modal = (cl, pos) => {
    overlay()

    // create a modal
    const existingModal = document.querySelector('#modal');
    if(existingModal) {
      return false;
    }
    const modal = document.createElement('div');
    modal.id = 'modal';
    if(cl) {
      modal.className = cl;
    }
    document.querySelector('body').appendChild(modal);

    centerEl(modal, pos);

    return modal;

  }

  /* Center an element on the page - EL MUST BE POSITION ABSOLUTE; If you want it to be centered within it's parent then it's parent must be some other then position: static
    @param   el   HTMLObject   The element to center;
    @param   offsetObj   Object  with x and y properties for offsetting the horizontal and vertical positions from the center point

    returns nothing (undefined). 
  */
  const centerEl = (el, offsetObj) => {

    const widthOfPage = window.innerWidth;
    const heightOfPage = window.innerHeight;
    const style = window.getComputedStyle(el);
    const widthOfEl = parseInt(style.width);
    const heightOfEl = parseInt(style.height);

    // Need to add on the page scrolling 
    var scrollTop = window.pageYOffset || (document.documentElement || document.body.parentNode || document.body).scrollTop

    // Center point x
    if(offsetObj) {
      if(!offsetObj.x) {
        el.style.left = ((widthOfPage - widthOfEl) / 2) + 'px';
      }else {
        el.style.left = (((widthOfPage - widthOfEl) + offsetObj.x) / 2) + 'px';
      }
      
      // Center point y
      if(!offsetObj.y) {
        el.style.top = ((heightOfPage - heightOfEl) / 2) + scrollTop + 'px';
      }else {
        el.style.top = (((heightOfPage - heightOfEl)) / 2) + offsetObj.y + scrollTop + 'px';
      }
    }else {
      el.style.left = ((widthOfPage - widthOfEl) / 2) + 'px';
      el.style.top = ((heightOfPage - heightOfEl) / 2) + scrollTop + 'px';
    }

    
  }

  /* Create a screen to block out items below the element you want to focus on,  ex for a modal with overlay switched only modal is above the screen and in focus 
    @PARAM   parentel  HTMLElementOBject     The element to screen over, default to full page body
    @PARAM   options   Object      Configurable options {backgroundColor: String}    
  */
  const overlay = (parentEl , styleObj) => {
    const el = parentEl || document.querySelector('body');
    const styles = styleObj || {
      backgroundColor: 'rgba(0,0,0, .7)'
    }
    const overlay = document.createElement('div');
    overlay.id = 'overlay';
    overlay.className = 'over-lay';
    el.appendChild(overlay);
    console.log(styles)
    for(var prop in styles){
      overlay.style[prop] = styles[prop]
    }
  }

  
  // Takes in an an error array or error objects with and builds an html output unordered list
  const errorOutput = (errorsArr) => {

    let htmlString = '';
    htmlString += '<ul class="fa-ul">';
    errorsArr.forEach((error) => {
     htmlString += '<li><span class="fa-li"><i class="fas fa-skull-crossbones"></i></span>';
     htmlString +=  error.msg;
     htmlString += '</li>';
    })  
    htmlString += '</ul>';

    return htmlString;
  }


  // REMOVE AN ELEMENT FROM THE DOM
  const removeFromDom = (el) => {
    el.parentNode.removeChild(el)
  }



  const exports = {
    modal,
    centerEl,
    errorOutput,
    overlay,
    removeFromDom
  }

  return exports;
})()

