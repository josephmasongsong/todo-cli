const fs = require('fs').promises;
const inquirer = require('inquirer');

const prompt = async ({ type, message, name, choices }, cb) => {
  const answer = await inquirer.prompt([{ type, message, name, choices }]);
  cb(answer);
};

const initialize = async () => {
  try {
    const files = await fs.readdir('./');
    if (files.includes('db.json')) {
      readFile();
    } else {
      createFile();
    }
  } catch (err) {
    console.error(err);
  }
};

const readFile = async () => {
  try {
    const data = await fs.readFile('db.json');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
};

const createFile = async () => {
  try {
    await fs.writeFile('db.json', JSON.stringify([]));
    readFile();
  } catch (err) {
    console.error(err);
  }
};

module.exports = {
  initialize,
  readFile,
  prompt,
};
