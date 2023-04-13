const fs = require('fs/promises');
const { prompt, readFile } = require('./util');
const prompts = require('./prompts');

async function tryCatch(promise) {
  try {
    const data = await promise;
    return [data, null];
  } catch (err) {
    console.error(err);
    return [null, err];
  }
}

const generateId = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 8);

const mapTodosToChoices = async () => {
  const todos = await readFile();
  return todos.map(({ id, title, complete }) => ({
    name: `${title} - ${!complete ? '❎ incomplete' : '✅ complete'}`,
    value: id,
  }));
};

const showTodo = async ({ id }) => {
  const todo = await getTodo(id);
  prompt(prompts.todoOptions(todo), whatDoNext);
};

const getTodo = async id => {
  const todos = await readFile();
  return (todo = todos.find(todo => todo.id === id));
};

// const getTodo = async ({ id }) => {
//   const todos = await readFile();
//   const todo = todos.find(todo => todo.id === id);
//   prompt(prompts.todoOptions(todo), whatDoNext);
// };

const createTodo = async ({ title }) => {
  const todo = {
    id: generateId(),
    title,
    complete: false,
  };

  const todos = await readFile();
  todos.push(todo);
  const data = JSON.stringify(todos);
  try {
    await fs.writeFile('db.json', data);
    console.log(`Successfully created todo!`);
    prompt(prompts.selectTodo(await mapTodosToChoices()), showTodo);
  } catch (err) {
    console.error(err);
  }
};

const updateTodo = async ({ id, title, complete }) => {
  const todos = await readFile();
  const newTodos = todos.map(todo => (todo.id === id ? { ...todo, title, complete } : todo));
  const data = JSON.stringify(newTodos);
  try {
    await fs.writeFile('db.json', data);
    console.log('Sucessfully updated todo.');
  } catch (err) {
    console.error(err);
  }
};

const deleteTodo = async id => {
  const todos = await readFile();
  const newTodos = todos.filter(todo => todo.id !== id);
  const data = JSON.stringify(newTodos);
  try {
    await fs.writeFile('db.json', data);
    console.log('Sucessfully deleted todo.');
  } catch (err) {
    console.error(err);
  }
};

const menu = {
  new: function () {
    prompt(prompts.createTodo, createTodo);
  },
  list: async function () {
    prompt(prompts.selectTodo(await mapTodosToChoices()), showTodo);
  },
  delete: function () {
    prompt(prompts.confirmDelete, choice => console.log(choice));
  },
  edit: function () {
    prompt(prompts.editTodo);
  },
};

const whatDoNext = async ({ menu }) => {
  if (menu === 'add') prompt(prompts.createTodo, createTodo);
  if (menu === 'list') prompt(prompts.selectTodo(await mapTodosToChoices()), showTodo);
  if (menu === 'edit') prompt(prompts.editTodo);
  if (menu === 'delete') prompt(prompts.confirmDelete, choice => console.log(choice));
};

prompt(prompts.userMenu, whatDoNext);
