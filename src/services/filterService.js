const Project = require('../models/Project');

function getLinksBar(count) {
   // ho many links will cover the count?
   const links = Math.ceil(count / 4)  // hard coded at 4 per page, consider changing to allow dynamic and changeable no displayed per page....

   var linksHTML = ``;
   for(i = 1; i <= links; i++) {
     linksHTML += `<li onclick="getPage(${i})">${i}</li>`
   }
   return linksHTML;
  }

module.exports = {
  getLinksBar
}