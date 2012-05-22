if (Meteor.is_server) {
  // this locks down the collection and prevents inserts, updates and deletes on the client side
  // but it requires you to write a Meteor.method that can be called from the client with Meteor.call
  // way easier than having to wire up RESTful framework and boilerplate
  Meteor.startup(function () {
    _.each(['ContactUsFormPosts'], function(collection) {
      _.each(['insert', 'update', 'remove'], function(method) {
        Meteor.default_server.method_handlers['/' + collection + '/' + method] = function() {};
      });
    });
  });

  var require = __meteor_bootstrap__.require;

  var path = require("path");
  var fs = require('fs');
  var base = path.resolve('.');

  if (base == '/'){
    base = path.dirname(global.require.main.filename);   
  }

  var email;
  var emailPath = 'node_modules/nodemailer';
  var publicEmailPath = path.resolve(base+'/public/'+emailPath);
  var staticEmailPath = path.resolve(base+'/static/'+emailPath);
  if (path.existsSync(publicEmailPath)){
    emailer = require(publicEmailPath);
  }
  else if (path.existsSync(staticEmailPath)){
    emailer = require(staticEmailPath);
  }
  else{
    console.log('WARNING Emailer not loaded. Node_modules not found');
  }

  // TODO CONFIGURATION SETTINGS
  // set your gmail or smtp settings here
  // See nodemailer for more settings
  // this demonstrates using Gmail to send mail
  //var config = {};
  //config.email_to = 'vinny.testerama@example.com'; 
  //config.email_from = 'Vinny Testeramaa <vinny.testerama@example.com>'; 
  //config.email_bcc = 'vinny.testerama@example.com'; 
  //config.emailer = {};
  //config.emailer.service = 'Gmail';
  //config.emailer.user = 'vtesterama@gmail.com';
  //config.emailer.pass = 'changeme';

  // create reusable transport method (opens pool of SMTP connections)
  var smtpTransport = emailer.createTransport('SMTP',{
      service: config.emailer.service,
      auth: {
          user: config.emailer.user,
          pass: config.emailer.pass
      }
  });

  function sendEmail(subject, body, htmlbody, to, from, bcc){
    console.log('*** sendEmail ***');
    var mailOptions = {
        from: from,
        to: to,
        subject: subject,
        text: body,
        html: htmlbody 
    }
    smtpTransport.sendMail(mailOptions 
      ,function(error, response){
        if(error){
          console.log(error);
        }else{
          console.log("Message sent: " + response.message);
          console.log("To: " + to);
        }
        // if you don't want to use this transport object anymore, uncomment following line
        //smtpTransport.close(); // shut down the connection pool, no more messages
      }
    );
  }

  Meteor.methods({
    insertContactUs: insertContactUs,
    sendEmaill: sendEmail
  });

  function insertContactUs(params){
    console.log('*** insertContactUs ***');
    //this.unblock();
    if(params){
      ContactUs.validateParams(params);
      ContactUs.validateEmail(params.email);
      var ts = Date.now();
      //note:  you could insert params as is if you wanted
      id = ContactUs.insert({
      created: ts, 
      name: params.name.slice(0,100),
      email: params.email.slice(0,100),
      subject: params.subject.slice(0,30),
      comments: params.comments.slice(0,1000)
      });
      //TODO process with callback
      if(id){
        sendEmail('Thank you for contacting us', 
          'Thank you for contacting us.  We will review your request and get back to you if necessary. Subject type:\n'+params.subject+'\nComments:\n'+params.comments+'\n\nThanks,\nCustomer Service',
          '<html><h1>Thank you for contacting us.</h1><p>We will review your comments and get back to you if necessary.</p><p>Subject: '+params.subject+'</p><p>Comments:</p>'+params.comments+'<p>Thanks,<br/>The Customer Service</p></html>',
          params.name+'<'+params.email+'>',
          config.email_from
        );
        sendEmail('Contact Form Submission: ' + params.subject,
          'Comments\n' + params.comments,
          '<html><p>From: '+params.name+'<'+params.email+'></p><p>Subject: '+params.subject+'</p><p>Comments:</p>'+params.comments+'</html>',
          config.email_to,
          params.name+'<'+params.email+'>'
        );
        return result = 'Thank you kindly!';
      } else {
        throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Failed to insert "contact us" request. Please retry.');
      }
    } else {
      throw new Meteor.Error(500, 'Zoinkies! Internal Server Error. Missing params.');
    }
  }

}

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
        $('#buttons-contact').fadeOut(1000, function(){
          $('#progress-contact').fadeIn(1000, function(){
           $('#bar-contact').width('66%');
           Meteor.call('insertContactUs', params, function (error, result) { 
            console.log('error: ' + error);
            console.log('result: ' + result);
              if(result){
                $('#bar-contact').width('100%');
                $('#progress-contact').fadeOut(1000, function(){
                  $('#bar-contact').width('33%');
                  $('#contact-form').fadeOut(2000, function(){
                    $('#buttons-contact').show();
                  });
                  Alert.setAlert('awesome!', result, 'alert-success', 'contact');
                  $('#contactUsDialog').fadeOut(3000, function(){
                    $('#contactUsDialog').modal('hide');
                    $('#contact-form').show();
                    $("#contact-form").reset();
                  }) 
                });
              } else {
                $('#progress-contact').fadeOut(1000, function(){
                  $('#bar-contact').width('33%');
                  console.log('error: ' + error);
                  if(error){
                    Alert.setAlert('Error', error + error.reason, 'alert-error', 'contact');  
                  } else {
                    Alert.setAlert('Error', 'Unknown Error', 'alert-error', 'contact');
                  }
                  $('#buttons-contact').fadeIn(1000);
                });
              }
           });
          });
        }); 
      } catch(error) {
        Alert.setAlert('Error', error.reason, 'alert-error', 'contact');
      }
    }
  }
  //function insertContactUs(){
    //client side stub can be used for side effect processing
    //console.log('insertContactUs client stub');
  //}
}

