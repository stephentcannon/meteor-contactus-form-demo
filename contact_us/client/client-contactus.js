if (Meteor.is_client) {

  Meteor.startup(function () {
    //placeholder if you want to code startup stuff
  });

  $(function() {
    $("#name").focus();
  });

  Template.contactus.events = {
    'click #btnContact': function (event) {
      var params = $('#contact-form').toJSON();
      try{
        ContactUs.validateParams(params);
        ContactUs.validateEmail(params.email);
        $('#buttons-contact').fadeOut(1000, 'linear', function(){
          $('#progress-contact').fadeIn(1000, 'linear', function(){
           $('#bar-contact').width('66%');
           Meteor.call('insertContactUs', params, function (error, result) { 
              if(result){
                $('#bar-contact').width('100%');
                $('#progress-contact').fadeOut(1000, 'linear', function(){
                  $('#bar-contact').width('33%');
                  $('#contact-form').fadeOut(2000, 'linear', function(){
                    $('#buttons-contact').show();
                  });
                  Alert.setAlert('Awesome!', result, 'alert-success', 'contact');
                  $('#contactUsDialog').fadeOut(3000, 'linear', function(){
                    $('#contactUsDialog').modal('hide');
                    $('#contact-form').show();
                    $("#contact-form").reset();
                  }) 
                });
              } else {
                $('#progress-contact').fadeOut(1000, 'linear', function(){
                  $('#bar-contact').width('33%');
                  if(error){
                    Alert.setAlert('Error', error + error.reason, 'alert-error', 'contact');  
                  } else {
                    Alert.setAlert('Error', 'Unknown Error', 'alert-error', 'contact');
                  }
                  $('#buttons-contact').fadeIn(1000, 'linear');
                });
              }
           });
          });
        }); 
      } catch(error) {
        Alert.setAlert('Error', error.reason, 'alert-error', 'contact');
      }
    }
  };
}

