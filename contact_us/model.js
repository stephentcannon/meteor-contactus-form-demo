ContactUs = new Meteor.Collection("ContactUs");

ContactUs.validateParams = function(params) {
  console.log('*** validateParams ***');
    for (var key in params) {
      value = params[key];
      if(_.isEmpty(value) || _.isUndefined(value) || 
      _.isNull(value)) {
        throw new Meteor.Error(500, 'Please enter your "'+ key + '".');
      }
    }
  };

ContactUs.validateEmail = function(email) { 
  console.log('*** validateEmail ***');
  // use either of these
  //   /^([a-zA-Z0-9_.-\+])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,4})+$/
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\  ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA  -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/  
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\  ".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA  -Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;    
  if(!re.test(email)){
    throw new Meteor.Error(500, 'Please enter a valid "email" address.'); 
  }
};