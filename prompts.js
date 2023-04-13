const inquirer = require('inquirer');

async function promptUser({ type, message, name, choices, pageSize }, cb) {
  const answer = await inquirer.prompt([{ type, message, name, choices, pageSize }]);
  cb(answer);
}

const mainMenu = {
  type: 'list',
  name: 'menu',
  message: 'Please choose one of the following:',
  choices: [
    { name: 'Create a todo', value: 'add' },
    { name: 'Show my todos', value: 'list' },
  ],
};

const confirmDelete = {
  type: 'confirm',
  name: 'delete',
  message: 'Are you sure you want to delete this todo?',
};

const addTodo = {
  type: 'input',
  name: 'title',
  message: 'What is your todo?',
};

const editTodo = {
  type: 'input',
  name: 'title',
  message: 'Edit your todo',
};

const deleteTodo = ({ title }) => {
  return {
    type: 'confirm',
    name: 'delete_todo',
    message: `Are you sure you want to delete "${title}"?`,
  };
};

const toggleStatus = ({ complete }) => {
  return {
    type: 'list',
    name: 'toggle_status',
    message: !complete ? 'Todo is incomplete' : 'Todo is complete',
    choices: [
      { name: 'mark complete', value: true },
      { name: 'mark incomplete', value: false },
    ],
  };
};

const selectTodo = choices => {
  return {
    type: 'list',
    name: 'id',
    message: 'Select a todo from the list for more options:',
    pageSize: 10,
    choices,
  };
};

const todoChoices = ({ complete }) => {
  return {
    type: 'list',
    name: 'menu',
    message: 'Please choose one of the following:',
    choices: [
      { name: 'Edit todo', value: 'edit' },
      !complete ? { name: 'Mark complete', value: 'complete' } : { name: 'Mark incomplete', value: 'complete' },
      { name: 'Delete todo', value: 'delete' },
      { name: 'Back to list', value: 'list' },
    ],
  };
};

module.exports = {
  mainMenu,
  addTodo,
  editTodo,
  deleteTodo,
  toggleStatus,
  selectTodo,
  todoChoices,
  confirmDelete,
  promptUser,
};
