async function promptUser({ type, message, name, choices, pageSize }, cb) {
  const answer = await inquirer.prompt([{ type, message, name, choices, pageSize }]);
  cb(answer);
}
