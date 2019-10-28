/*
  GENERATES THE HTML LIST FOR EACH PAGE OF PAGINATION.
  @PARAM:     count      INT        The number of projects/blogs in the databse 
  @PARAM:     type       String     value= 'projects'|'blogs'  Passed to getPage() to tell it what pages we want to return be it blogs page or projects pages
*/

function getLinksBar(count, type) {
  console.log('get links bar says type is ', type,   typeof type)
  const links = Math.ceil(count / 4)  // hard coded at 4 for now? REVISE.

  var linksHTML = ``;
  for(i = 1; i <= links; i++) {
    linksHTML += `<li onclick="gridService.getPage(${i}, '${type}')">${i}</li>`
  }
  return linksHTML;
}




module.exports = {
 getLinksBar
}