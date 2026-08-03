function time() {
  return new Date().toISOString();
}

// Minimal ANSI color helpers (compatible with CommonJS and no external deps)
const colors = {
  dim: (s) => `\x1b[2m${s}\x1b[22m`,
  blue: (s) => `\x1b[34m${s}\x1b[39m`,
  yellow: (s) => `\x1b[33m${s}\x1b[39m`,
  red: (s) => `\x1b[31m${s}\x1b[39m`,
  green: (s) => `\x1b[32m${s}\x1b[39m`,
  magenta: (s) => `\x1b[35m${s}\x1b[39m`
};

const logger = {
  info: (...args) => {
    console.log(`${colors.dim(time())} ${colors.blue('[INFO]')} ${args.join(' ')}`);
  },

  warn: (...args) => {
    console.warn(`${colors.dim(time())} ${colors.yellow('[WARN]')} ${args.join(' ')}`);
  },

  error: (...args) => {
    console.error(`${colors.dim(time())} ${colors.red('[ERROR]')} ${args.join(' ')}`);
  },

  success: (...args) => {
    console.log(`${colors.dim(time())} ${colors.green('[SUCCESS]')} ${args.join(' ')}`);
  },

  debug: (...args) => {
    if (process.env.DEBUG) {
      console.log(`${colors.dim(time())} ${colors.magenta('[DEBUG]')} ${args.join(' ')}`);
    }
  }
};

module.exports = logger;
