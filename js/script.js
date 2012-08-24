(function(window, undefined) {

  window.ondragover = function () {
    return false;
  };

  window.ondragend = function () {
    return false;
  };

  window.ondrop = function (e) {
    e.stopPropagation();
    e.preventDefault();
    var file = e.dataTransfer.files[0];
    var reader = new FileReader();
    reader.onload = function (event) {
      var data = event.target.result;
      try {
        data = JSON.parse(data);
        // TODO: Fixme.
        var scope = angular.element("body").scope();
        $('#dropArea').removeClass('visible');
        scope.$apply(function() {
          scope.updateHar(data);
        });
      }
      catch(e) {
        alert(e);
      }
    };
    reader.readAsText(file);
    return false;
  };


  // TODO: Fixme, Do with angular.
  $('.network-larger-resources-status-bar-item').click(function (e){
    $(this).toggleClass('toggled-on');
    $('.network-log-grid').toggleClass('small');
  });
})(window);

// Hacks to workaround issues with chrome dev tools js.
var Preferences = Preferences || {};
var WebInspector = WebInspector || {}
