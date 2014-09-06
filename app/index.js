'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');

var JadeGenerator = module.exports = function JadeGenerator(args, options) {
  yeoman.generators.Base.apply(this, arguments);

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  options['test-framework'] = this.testFramework;

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', {
    as: 'app',
    options: {
      options: {
        'skip-message': options['skip-install-message'],
        'skip-install': options['skip-install']
      }
    }
  });

  this.pkg = JSON.parse(
    this.readFileAsString(path.join(__dirname, '../package.json'))
  );

};

util.inherits(JadeGenerator, yeoman.generators.Base);

JadeGenerator.prototype.askFor = function askFor() {
  var cb = this.async(),
    welcomeMsg = 'You are running generator-ghostTheme version: ' + this.pkg.version,
    prompts;

  console.log(welcomeMsg);

  prompts = [
    {
      name: 'ghostDir',
      message: 'Locate your Ghost directory',
      default: '../ghost'
    },
    {
      name: 'themeName',
      message: 'Name your theme'
    }
  ];

  this.prompt(prompts, function(props) {
    this.themeName = props.themeName || this.appname;
    this.ghostDir = props.ghostDir;

    cb();
  }.bind(this));
};

JadeGenerator.prototype.gruntfile = function gruntfile() {
  this.template('_Gruntfile.js', 'Gruntfile.js');
  this.template('_config.json', 'config.json');
};

JadeGenerator.prototype.tools = function tools() {
  this.copy('bowerrc', '.bowerrc');
  this.template('_bower.json', 'bower.json');
  this.template('_package.json', 'package.json');
};

JadeGenerator.prototype.editor = function editor() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

JadeGenerator.prototype.git = function git() {
  this.template('_gitignore', '.gitignore');
};

JadeGenerator.prototype.hbs = function hbs() {
  this.copy('templates/_index.hbs', 'templates/index.hbs');
};

JadeGenerator.prototype.projectFiles = function projectFiles() {
  this.copy('styles/_main.styl', 'styles/main.styl');

  this.copy('js/_main.js', 'js/main.js');
};

JadeGenerator.prototype.install = function() {
  if (this.options['skip-install']) {
    return;
  }

  var done = this.async();
  this.installDependencies({
    skipMessage: this.options['skip-install-message'],
    skipInstall: this.options['skip-install'],
    callback: done
  });
};
