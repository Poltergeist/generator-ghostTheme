module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    watch: {
      stylus: {
        files: 'styles/**/*.styl',
        tasks: ['stylus']
      },
      copy: {
        files: '**/*.hbs',
        tasks: ['copy:hbs']
      },
      uglify: {
        files: 'js/*.js',
        tasks: ['uglify']
      },
      css: {
        files: [
        '.tmp/*'
        ],
        tasks: ['cssmin']
      }
    },
    uglify: {
      options: {
        mangle: false
      },
      combinejs: {
        files: {
          '<%= ghostDir %>content/themes/<%= themeName %>/assets/js/all.min.js':
          [
            'js/*.js'
          ]
        }
      }
    },
    copy: {
      hbs: {
        files: [{
          expand: true,
          dot: true,
          dest: '<%=ghostDir%>content/themes/<%= themeName %>/',
          src: [
            '*.hbs',
            '**/*.hbs'
          ]
        }]
      }
    },
    stylus: {
      compile: {
        files: [{
          expand: true,
          cwd: 'styles',
          src: ['{,*/}*.styl', '!**/_*'],
          dest: '.tmp',
          ext: '.css'
        }],
        options: {
          compress: false,
          // convert the css url() declaration into nib inline imaging function
          // this converts images smaller than 30kb to data url
          urlfunc: 'url'
        }
      }
    },
    cssmin: {
      combine: {
        files: {
          '<%= ghostDir %>content/themes/<%= themeName %>/assets/css/style.css': [
            'bower_components/normalize-css/normalize.css', '.tmp/*.css']
        }
      }
    },


  });

  grunt.registerTask('serve', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'copy:hbs',
      'stylus',
      'cssmin',
      'uglify',
      'watch'
    ]);
  });


  // Load grunt plugins.
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');

};
