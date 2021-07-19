import {type_effect} from './typed.js'

$(document).ready(function() {

  function NeroResponse() {
     $.ajax({
          url: "/nero",
          type: "POST",
          data: "body="+$('#main.droid').text(),
          dataType: 'json', 
          success: function(response) {   
              let data = response['data']
              type_effect(data)
          },
          error:function() {
              alert("Server failure, try again");
          }
      });
  }   
  
   
  $('div#main').keypress(function(e) {
    if(e.keyCode == 13) {
        // $('#typing-animation.quote').text("")
        NeroResponse();
    }
  });
  
  
  $('#bt').click(function() {
    SendData();
  });

});