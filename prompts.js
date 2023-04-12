const userMenu = {
  type: 'list',
  name: 'menu',
  message: 'Please choose one of the following:',
  choices: [
    { name: 'Create a todo', value: 'add' },
    { name: 'List my todos', value: 'list' },
    { name: 'Exit', value: 'exit' },
  ],
};

const confirmDelete = {
  type: 'confirm',
  name: 'delete',
  message: 'Are you sure you want to delete this todo?',
};

const createTodo = {
  type: 'input',
  name: 'title',
  message: 'What is your todo?',
};

const editTodo = ({ title }) => {
  return {
    type: 'input',
    name: 'title',
    message: `Editing todo: "${title}"`,
    default: `${title}`,
  };
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

const todoOptions = ({ complete }) => {
  return {
    type: 'list',
    name: 'menu',
    message: 'Please choose one of the following:',
    choices: [
      { name: 'Edit', value: 'edit' },
      !complete ? { name: 'Mark complete', value: 'complete' } : { name: 'Mark incomplete', value: 'incomplete' },
      { name: 'Delete', value: 'delete' },
    ],
  };
};

module.exports = {
  userMenu,
  createTodo,
  editTodo,
  deleteTodo,
  toggleStatus,
  selectTodo,
  todoOptions,
  confirmDelete,
};
