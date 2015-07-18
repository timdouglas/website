module.exports = function(grunt) {
  'use strict';
  
  grunt.initConfig({
    watch: {
      css: {
        files: ['css/**/*.css'],
        tasks: 'css'
      },
      html: {
        files: ['src/**/*.html'],
        tasks: 'html'
      },
      js: {
        files: ['js/**/*.js'],
        tasks: 'js'
      },
      images: {
        files: ['images/**/*.{png,ico,jpg,jpeg}'],
        tasks: 'images'
      },
      livereload: {
        options: {
          livereload: {
            port: 35731
          }
        },
        files: [
          'dist/**/*.html',
          'dist/assets/css/{,*/}*.css',
          'dist/assets/js/{,*/}*.js'
        ]
      }
    },
    
    //adds the livereload snippet to each page
    livereload_snippet: {
      options: {
        hostname: 'me.dev',
        port: 35731
      },
      add: {
        options: {
          add: true
        },
        src: ['src/templates/headjs.html']
      },
      remove: {
        options: {
          add: false
        },
        src: ['src/templates/headjs.html']
      }
    },
    
    clean: {
      dist: ['dist']
    },
    
    copy: {
      css: {
        files: [
          { expand: true, cwd: './css', src: ['./**/*.*'], dest: 'dist/assets/css' }
        ]
      },
      images: {
        files: [
          { expand: true, cwd: './images', src: ['./**/*.*', '!favicon/*.*'], dest: 'dist/assets/images' }
        ]
      },
      js: {
        files: [
          { expand: true, cwd: './js', src: ['./**/*.*'], dest: 'dist/assets/js' }
        ]
      },
      favicons: {
        files: [
          { expand: true, cwd: './images/favicon', src: ['./**/*.*'], dest: 'dist/' }
        ]
      },
      html: {
        files: [
          { expand: true, cwd: './src', src: ['./**/*.*'], dest: 'dist/' }
        ]
      }
    },
    
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        force: true,
        '-W040': true
      },
      all: {
        src: 'js/**/*.js'
      }
    },
    
    uglify: {
      home: {
        files: [{ src: 'js/*.js', dest: 'dist/assets/js/td.js' }]
      }
    }
    
  });
  
  grunt.registerTask('remove_snippet', ['livereload_snippet:remove']);
  grunt.registerTask('add_snippet', ['livereload_snippet:add']);
  grunt.registerTask('css', ['copy:css']);
  grunt.registerTask('images', ['copy:images']);
  grunt.registerTask('html', ['copy:html']);
  grunt.registerTask('js', ['jshint', 'copy:js']);
  
  grunt.registerTask('default', ['clean', 'remove_snippet', 'copy']);
  grunt.registerTask('dev', ['clean', 'add_snippet', 'copy', 'watch']);
  
  grunt.registerTask('prod', ['clean', 'remove_snippet', 'copy', 'uglify']);
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
};