import fs from 'fs';

import Robot from './robot';

const commands = fs.readFileSync('./src/commands.txt', 'utf-8');
const toyRobot = new Robot();

commands.split(/\r?\n/).forEach((command) => toyRobot.execCommand(command));
