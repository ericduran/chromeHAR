module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    lint: {
      all: [
        'js/libs/HAREntry.js',
        'js/script.js',
        'js/controllers.js'
      ]
    },
    jshint: {
      options: {
        curly: true,
        eqeqeq: true,
        noarg: true,
        sub: true,
        undef: true,
        eqnull: true,
        es5: true,
        strict: true
      },
      globals: {
        $: true,
        angular: true,
        FileReader: true,
        HAREntry: true,
        Modernizr: true
      }
    }
  });

  // Default task.
  grunt.registerTask('default', 'lint');

};
