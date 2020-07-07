import chalk from 'chalk';

const log = console.log;

const logRed = (message: string) => {
 log(chalk.red(message));
}

const logBlue = (message: string) => {
 log(chalk.blue(message));
}

const logGreen = (message: string) => {
 log(chalk.green(message));
}

export {
 logRed,
 logGreen,
 logBlue,
}
