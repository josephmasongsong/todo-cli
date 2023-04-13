const fs = require('fs/promises');
const { promptUser, mainMenu, selectTodo, addTodo, todoChoices, editTodo } = require('./prompts');

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

async function findTodo({ id }) {
  const todos = await fetchTodos();
  const todo = todos.find(todo => todo.id === id);
  promptUser(todoChoices(todo), todoChoicesPath);
}

async function mapTodosToChoices() {
  const todos = await fetchTodos();
  return todos.map(({ id, title, complete }) => ({
    name: `${title} - ${!complete ? '❎ incomplete' : '✅ complete'}`,
    value: id,
  }));
}

async function createTodo({ title }) {
  const todo = {
    id: Math.random()
      .toString(36)
      .replace(/[^a-z0-9]+/g, '')
      .substring(0, 8),
    title,
    complete: false,
  };
  const todos = await fetchTodos();
  todos.push(todo);
  await saveToJson(todos);
  promptUser(todoChoices(todo), choice => console.log(choice));
}

async function deleteTodo({ id }) {
  const todos = await fetchTodos();
  const updatedTodos = todos.filter(todo => todo.id !== id);
  await saveToJson(updatedTodos);
}

async function updateTodos(updatedTodo) {
  const todos = await fetchTodos();
  const updatedTodos = todos.map(todo => (todo.id === updatedTodo.id ? updatedTodo : todo));
  await saveToJson(updatedTodos);
  promptUser(selectTodo(await mapTodosToChoices()), findTodo);
}

function editTitle({ title }) {
  const updatedTodo = {
    ...todo,
    title,
  };
  updateTodos(updatedTodo);
}

function toggleComplete(todo) {
  const updatedTodo = {
    ...todo,
    complete: !todo.complete,
  };
  updateTodos(updatedTodo);
}

async function mainMenuPath({ menu }) {
  if (menu === 'list') promptUser(selectTodo(await mapTodosToChoices()), findTodo);
  if (menu === 'add') promptUser(addTodo, createTodo);
}

async function todoChoicesPath({ menu }) {
  if (menu === 'list') promptUser(selectTodo(await mapTodosToChoices()), findTodo);
  if (menu === 'edit') promptUser(editTodo, editTitle);
}

async function init() {
  promptUser(mainMenu, mainMenuPath);
}

init();
