const chalk = require('chalk');

function time() {
  return new Date().toISOString();
}

const logger = {
  info: (...args) => {
    console.log(`${chalk.dim(time())} ${chalk.blue('[INFO]')} ${args.join(' ')}`);
  },

  warn: (...args) => {
    console.warn(`${chalk.dim(time())} ${chalk.yellow('[WARN]')} ${args.join(' ')}`);
  },

  error: (...args) => {
    console.error(`${chalk.dim(time())} ${chalk.red('[ERROR]')} ${args.join(' ')}`);
  },

  success: (...args) => {
    console.log(`${chalk.dim(time())} ${chalk.green('[SUCCESS]')} ${args.join(' ')}`);
  },

  debug: (...args) => {
    if (process.env.DEBUG) {
      console.log(`${chalk.dim(time())} ${chalk.magenta('[DEBUG]')} ${args.join(' ')}`);
    }
  }
};

module.exports = logger;
