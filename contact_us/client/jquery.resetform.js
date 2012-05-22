if (Meteor.is_client)
  
(function($){
  $.fn.reset = function(fn) {
  return fn ? this.bind("reset", fn) : this.trigger("reset");
  };
})(jQuery);