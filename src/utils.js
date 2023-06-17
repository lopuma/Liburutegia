const chalk = require('chalk');

class _log {
  static ready(text) {
    console.info('- ' + chalk.green('ready'), text);
  }

  static warn(text) {
    console.warn('- ' + chalk.yellow('warn'), text);
  }

  static error(text) {
    console.error('- ' + chalk.red('error'), text);
  }

  static debug(text) {
    console.log('- ' + chalk.magenta('debug'), text);
  }
}

module.exports = _log;