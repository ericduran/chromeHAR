(function(window, undefined) {
  'use strict';

  var support = Modernizr.draganddrop && document.querySelector && window.JSON;
  if (!support) {
    // Add disabled class.
    $("body").addClass("disabled");
  }
  else {

    // TODO: Fixme, Do with angular.
    $('.network-larger-resources-status-bar-item').click(function (e){
      $(this).toggleClass('toggled-on');
      $('.network-log-grid').toggleClass('small');
    });

    // Add a sample HAR that way anyone could easily test the app.
    $('.sample').click(function (e){
      e.preventDefault();
      // Lets load the sample HAR.
      var scope = angular.element("body").scope();
      $('#dropArea').removeClass('visible');
      $.getJSON('sample.har', function(d) {
        scope.$apply(function() {
          scope.updateHar(d);
        });
      });
    });
  }
})(window);

// Hacks to workaround issues with chrome dev tools js.
var Preferences = Preferences || {};
var WebInspector = WebInspector || {};
