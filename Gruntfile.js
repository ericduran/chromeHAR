module.exports = function(grunt) {
  "use strict";

  grunt.loadNpmTasks("grunt-contrib-jshint");

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        "js/libs/HAREntry.js",
        "js/controllers.js",
        "js/script.js"
      ],
      options: {
        jshintrc: ".jshintrc"
      }
    }
  });

  // Default task.
  grunt.registerTask("default", ["jshint"]);

};
