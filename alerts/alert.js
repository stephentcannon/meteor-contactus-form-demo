if (Meteor.is_client) {
  Alert = {};
  var timer;

  Alert.setAlert = function (title, message, type, selector){
    window.clearTimeout(timer);
    $('#alert-'+selector).addClass(type);
    $('#alert-'+selector+' .close').live('click',function(){
      $(this).parent().hide();
    });
    $('#alert-title-'+selector).html(title);
    $('#alert-message-'+selector).html(message);
    $('#alert-'+selector).fadeIn(1000, 'linear', function(){
      timer=window.setTimeout(function() {
        $('#alert-'+selector).fadeOut(1000, 'linear', function(){
          $('#alert-'+selector).removeClass(type);
          $('#alert_title-'+selector).html('');
          $('#alert_message-'+selector).html('');
          $('#alert-'+selector).hide(); 
        });
      }, 2000);
    });
  }
}
