'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var npmName = require('npm-name');


var hubotStartSay = function() {
  return  '                     _____________________________  ' + "\n" +
          '                    /                             \\ ' + "\n" +
          ' '+chalk.cyan('  //\\')+'              |      Extracting input for    |' + "\n" +
          ' '+chalk.cyan(' ////\\  ')+'  '+chalk.yellow('_____')+'    |   self-replication process   |' + "\n" +
          ' '+chalk.cyan('//////\\  ')+chalk.yellow('/')+chalk.cyan('_____')+chalk.yellow('\\')+'   \\                             / ' + "\n" +
          ' '+chalk.cyan('=======') + chalk.yellow(' |')+chalk.cyan('[^_/\\_]')+chalk.yellow('|')+'   /----------------------------  ' + "\n" +
          '  '+chalk.yellow('|   | _|___')+'@@'+chalk.yellow('__|__')+'                                ' + "\n" +
          '  '+chalk.yellow('+===+/  ///     ')+chalk.cyan('\\_\\')+'                               ' + "\n" +
          '   '+chalk.cyan('| |_')+chalk.yellow('\\ /// HUBOT/')+chalk.cyan('\\\\')+'                             ' + "\n" +
          '   '+chalk.cyan('|___/')+chalk.yellow('\\//      /')+chalk.cyan('  \\\\')+'                            ' + "\n" +
          '         '+chalk.yellow('\\      /   +---+')+'                            ' + "\n" +
          '          '+chalk.yellow('\\____/    |   |')+'                            ' + "\n" +
          '           '+chalk.cyan('| //|')+'    '+chalk.yellow('+===+')+'                            ' + "\n" +
          '            '+chalk.cyan('\\//')+'      |xx|                            ' +
          "\n";

};

var hubotEndSay = function() {
  return  '                     _____________________________  ' + "\n" +
          ' _____              /                             \\ ' + "\n" +
          ' \\    \\             |   Self-replication process   |' + "\n" +
          ' |    |    '+chalk.yellow('_____')+'    |          complete...         |' + "\n" +
          ' |__'+chalk.cyan('\\\\')+'|   '+chalk.yellow('/')+chalk.cyan('_____')+chalk.yellow('\\')+'   \\     Good luck with that.    / ' + "\n" +
          '   '+chalk.cyan('|//') + chalk.yellow('+  |')+chalk.cyan('[^_/\\_]')+chalk.yellow('|')+'   /----------------------------  ' + "\n" +
          '  '+chalk.yellow('|   | _|___')+'@@'+chalk.yellow('__|__')+'                                ' + "\n" +
          '  '+chalk.yellow('+===+/  ///     ')+chalk.cyan('\\_\\')+'                               ' + "\n" +
          '   '+chalk.cyan('| |_')+chalk.yellow('\\ /// HUBOT/')+chalk.cyan('\\\\')+'                             ' + "\n" +
          '   '+chalk.cyan('|___/')+chalk.yellow('\\//      /')+chalk.cyan('  \\\\')+'                            ' + "\n" +
          '         '+chalk.yellow('\\      /   +---+')+'                            ' + "\n" +
          '          '+chalk.yellow('\\____/    |   |')+'                            ' + "\n" +
          '           '+chalk.cyan('| //|')+'    '+chalk.yellow('+===+')+'                            ' + "\n" +
          '            '+chalk.cyan('\\//')+'      |xx|                            ' +
          "\n";
};

var HubotGenerator = yeoman.generators.Base.extend({

  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    // Arguments are not required since interactive mode is the default
    this.argument('botowner', { type: String, required: false, desc: 'Bot owner i.e. Full Name <email@example.com>' });
    this.botOwner = this.botowner;

    this.argument('botname', { type: String, required: false, desc: 'Bot name' });
    this.botName = this.botname;

    this.argument('botdescription', { type: String, required: false, desc: 'Bot description', defaults: 'A simple helpful robot for your Company' });
    this.botDescription = this.botdescription;

    this.argument('botadapter', { type: String, required: false, desc: 'Bot adapter', defaults: 'campfire' });
    this.botAdapter = this.botadapter;

    this.log('Got some args, they are: ' + this.botOwner + ', ' + this.botName + ', ' + this.botDescription + ', ' + this.botAdapter);
  },

  initializing: function () {
    this.pkg = require('../../package.json');

    this.externalScripts = [
      'hubot-diagnostics',
      'hubot-help',
      'hubot-heroku-keepalive',
      'hubot-google-images',
      'hubot-google-translate',
      'hubot-pugme',
      'hubot-maps',
      'hubot-redis-brain',
      'hubot-rules',
      'hubot-shipit',
      'hubot-youtube'
    ];

    this.hubotScripts = [
    ];
  },

  prompting: {
    askFor: function () {
      var done = this.async();
      var userName = this.user.git.name();
      var userEmail = this.user.git.email();

      var prompts = [{
        name: 'botOwner',
        message: 'Owner',
        default: userName+' <'+userEmail+'>'
      }];

      this.log(hubotStartSay());

      this.prompt(prompts, function (props) {
        this.botOwner = props.botOwner;

        done();
      }.bind(this));
    },

    askForBotNameAndDescription: function() {
      var done = this.async();
      var botName = this._.slugify(this.appname);

      var prompts = [{
        name: 'botName',
        message: 'Bot name',
        default: botName
      },
      {
        name: 'botDescription',
        message: 'Description',
        default: 'A simple helpful robot for your Company'
      }];

      this.prompt(prompts, function (props) {
        this.botName = props.botName;
        this.botDescription = props.botDescription;

        done();
      }.bind(this));
    },

    askForBotAdapter: function() {
      var done = this.async();
      var prompts = [{
        name: 'botAdapter',
        message: 'Bot adapter',
        default: 'campfire',
        validate: function (botAdapter) {
          var done = this.async();

          if (botAdapter == 'campfire') {
            done(true);
            return
          }

          var name = 'hubot-' + botAdapter;
          npmName(name, function (err, available) {
            console.log("got back " + available);
            if (available) {
              done("Can't find that adapter on NPM, try again?");
              return;
            }

            done(true);
          });
        }
      }];

      this.prompt(prompts, function (props) {
        this.botAdapter = props.botAdapter;

        done();
      }.bind(this));
    }
  },

  writing: {
    app: function () {
      this.mkdir('bin');
      this.copy('bin/hubot', 'bin/hubot');
      this.copy('bin/hubot.cmd', 'bin/hubot.cmd');

      this.template('Procfile', 'Procfile');
      this.template('README.md', 'README.md');

      this.write('external-scripts.json', JSON.stringify(this.externalScripts, undefined, 2));
      this.write('hubot-scripts.json', JSON.stringify(this.hubotScripts, undefined, 2));

      this.copy('gitignore', '.gitignore');
      this.template('_package.json', 'package.json');

      this.directory('scripts', 'scripts');
    },

    projectfiles: function () {
      this.copy('editorconfig', '.editorconfig');
    }
  },

  end: function () {
    var packages = ['hubot', 'hubot-scripts'];
    packages = packages.concat(this.externalScripts);

    if (this.botAdapter != 'campfire') {
      packages.push('hubot-' + this.botAdapter);
    }

    this.npmInstall(packages, {'save': true});

    this.log(hubotEndSay());

  }
});

module.exports = HubotGenerator;
