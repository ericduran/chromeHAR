module.exports = function(grunt) {
  "use strict";

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
    },
    compass: {
      all: {
        options: {
          config: "config.rb"
        }
      }
    },
    watch: {
      gruntfile: {
        files: "Gruntfile.js",
        tasks: ["jshint:gruntfile"],
        options: {
          nocase: true
        }
      },
      src: {
        files: ["sass/*.scss"],
        tasks: ["compass"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-compass");

  // Default task.
  grunt.registerTask("default", ["compass", "jshint"]);

};
