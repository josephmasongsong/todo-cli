const fs = require('fs/promises');
const inquirer = require('inquirer');

async function fetchTodos() {
  try {
    const data = await fs.readFile('todos.json');
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
}

async function saveToJson(todos) {
  try {
    const data = JSON.stringify(todos);
    await fs.writeFile('todos.json', data);
    console.log('Changes saved!');
  } catch (err) {
    console.error(err);
  }
}

async function generateChoices() {
  const todos = await fetchTodos();
  return todos.map(({ id, title, complete }) => ({
    name: `${!complete ? '❌' : '✅'} ${title}`,
    value: id,
  }));
}

async function prompt(questions, cb = null, id = null) {
  const answers = await inquirer.prompt(questions);
  if (id != undefined) answers.id = id;
  if (cb != undefined) cb(answers);
}

function generateId() {
  return Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 8);
}

async function createTodo(title) {
  const todo = {
    id: generateId(),
    title,
    complete: false,
  };
  const todos = await fetchTodos();
  todos.push(todo);
  await saveToJson(todos);
  prompt(menuQuestions, choicesPath);
}

async function updateTitle(id, title) {
  const todos = await fetchTodos();
  const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, title } : todo));
  await saveToJson(updatedTodos);
  prompt(menuQuestions, choicesPath);
}

async function updateStatus(id, complete) {
  const todos = await fetchTodos();
  const updatedTodos = todos.map(todo => (todo.id === id ? { ...todo, complete } : todo));
  await saveToJson(updatedTodos);
  prompt(menuQuestions, choicesPath);
}

async function deleteTodo(id) {
  const todos = await fetchTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  await saveToJson(updatedTodos);
  prompt(menuQuestions, choicesPath);
}

function choicesPath(choice) {
  const pathObject = {
    create: ({ title }) => createTodo(title),
    list: ({ id }) => prompt(todoMenuQuestions, choicesPath, id),
    edit: ({ id, title }) => updateTitle(id, title),
    todos: () => prompt(menuQuestions, choicesPath),
    delete: ({ remove, id }) => {
      remove ? deleteTodo(id) : prompt(todoMenuQuestions, choicesPath);
    },
    status: ({ complete, id }) => updateStatus(id, complete),
    quit: () => console.log('Goodbye!'),
  };
  return pathObject[choice['menu']](choice);
}

const menuQuestions = [
  {
    type: 'list',
    name: 'menu',
    message: 'Please select one of the following choices:',
    choices: [
      { name: 'Create a new todo', value: 'create' },
      { name: 'Show me a list of todos', value: 'list' },
      { name: 'Quit', value: 'quit' },
    ],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Enter your todo...',
    when: answers => answers.menu === 'create',
  },
  {
    type: 'list',
    name: 'id',
    message: 'Select a todo for more options...',
    pageSize: 25,
    choices: async () => await generateChoices(),
    when: answers => answers.menu === 'list',
  },
];

const todoMenuQuestions = [
  {
    type: 'list',
    name: 'menu',
    message: 'Please choose one of the following:',
    choices: [
      { name: 'Edit todo', value: 'edit' },
      { name: 'Toggle complete', value: 'status' },
      { name: 'Delete todo', value: 'delete' },
      { name: 'Back to menu', value: 'todos' },
    ],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Edit your todo',
    when: answers => answers.menu === 'edit',
  },
  {
    type: 'confirm',
    name: 'remove',
    message: 'Are you sure you want to delete this todo?',
    when: answers => answers.menu === 'delete',
  },
  {
    type: 'confirm',
    name: 'complete',
    message: 'Is this todo complete?',
    when: answers => answers.menu === 'status',
  },
];

prompt(menuQuestions, choicesPath);
