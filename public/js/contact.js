(function(fk){
   // get a reference to the form fields. 
   document.addEventListener("DOMContentLoaded", function(event) { 
    //  console.log(event)
    const name = document.querySelector('#name');
    const email = document.querySelector('#email');
    const message = document.querySelector('#message');
    const check = document.querySelector('#last-name'); // check
    const button = document.querySelector('button');
 
    button.onclick = function(e) {
      let errorMsg = [];
      let errorHTML= '';
      let modalHTML = '';
      e.preventDefault();

     if(!name.value.trim()) {
       errorMsg.push({
          msg: 'Name is a required field',
          param: 'name',
          value: ''
     });
     }
 
     if(!email.value.trim()) {
       errorMsg.push({
         msg: 'Email is a required field',
         param: 'email',
         value: ''
       })
     }
 
     if(!message.value.trim()) {
       errorMsg.push({
        msg: 'Need a message to submit the form!',
        param: 'message',
        value: ''
      })
     }
 
     if(errorMsg.length > 0){
       let modal = fk.modal('modal-form-error', {y: -100});
       errorHTML = fk.errorOutput(errorMsg)
       modalHTML += '<h2>-Error-!<i class="fas fa-exclamation-triangle"></i></h2>';
       modalHTML += errorHTML
       modalHTML += '<div class="btn-wrapper"><button id="closeForm" class="btn1">CLOSE</button></div>'
       modal.innerHTML = modalHTML;
       
       const closeForm = document.querySelector('#closeForm')
       closeForm.addEventListener("click", () => {
        fk.removeFromDom(modal);
        fk.removeFromDom(document.querySelector('#overlay'))
       })
     }else {

      fetch('/contact', {
        method: 'POST',
        body: `name=${name.value}&email=${email.value}&message=${message.value}&check=${check.value}`,
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      }).then((response) => {
        return response.json();
      }).then((data) => {   
        if(data.errors) {
          let modal = fk.modal('modal-form-error', {y: -100});
          errorHTML = fk.errorOutput(data.errors)
          modalHTML += '<h2>- Error -!<i class="fas fa-exclamation-triangle"></i></h2>';
          modalHTML += errorHTML
          modalHTML += '<div class="btn-wrapper"><button id="closeForm" class="btn1">CLOSE</button></div>'
          modal.innerHTML = modalHTML;
          closeForm.addEventListener("click", () => {
             fk.removeFromDom(modal);
             fk.removeFromDom(document.querySelector('#overlay'))
           })
        }else  {
          // Reset the form 
          name.value = '';
          email.value = '';
          message.value = '';
          check.value = '';
          console.log(data.msg)
          let modal = fk.modal('modal-success', {y: -100});
          modalHTML += '<h2>- Message Sent - !<i class="fas fa-clipboard-check"></i></h2>';
          modalHTML += '<div class="modal-success-msg">Thanks for the message, I\'ll get back to you soon.</div>';
          modalHTML += '<div class="btn-wrapper"><button id="closeForm" class="btn1">CLOSE</button></div>'
          modal.innerHTML = modalHTML;
          setTimeout(() => {
            fk.removeFromDom(modal);
            fk.removeFromDom(document.querySelector('#overlay'))
          },5000);
          closeForm.addEventListener("click", () => {
            fk.removeFromDom(modal);
            fk.removeFromDom(document.querySelector('#overlay'));
          })
        }
      }).catch((e) => {
        console.log(e.message);
      })
     }
     
    }
  });

})(funky)

