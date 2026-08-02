const chalk = require("chalk");

module.exports = {

    info(message) {
        console.log(
            chalk.blue("[INFO]"),
            chalk.white(message)
        );
    },

    success(message) {
        console.log(
            chalk.green("[SUCCESS]"),
            chalk.white(message)
        );
    },

    warn(message) {
        console.log(
            chalk.yellow("[WARNING]"),
            chalk.white(message)
        );
    },

    error(message) {
        console.log(
            chalk.red("[ERROR]"),
            chalk.white(message)
        );
    },

    ready(message) {
        console.log(
            chalk.magenta("[READY]"),
            chalk.white(message)
        );
    }
};
