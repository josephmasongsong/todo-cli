import fs from 'fs/promises';
import inquirer from 'inquirer';

let todos = null;

const fetchTodos = async () => {
  const data = await fs.readFile('todos.json');
  return JSON.parse(data);
};

const loadTodosData = async () => {
  todos = await fetchTodos();
};

const save = async newTodos => {
  const data = JSON.stringify(newTodos);
  await fs.writeFile('todos.json', data);
  todos = newTodos;
  console.log('Saved!');
  prompt(questions1, choicesPath);
};

const generateChoices = () => {
  const choices = todos.map(({ id, title, complete }) => ({
    name: `${!complete ? '❌' : '✅'} ${title}`,
    value: id,
  }));
  return choices;
};

const generateID = () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substring(0, 8);

const createTodo = title => {
  return {
    id: generateID(),
    title,
    complete: false,
  };
};

const addTodo = title => {
  const todo = createTodo(title);
  const newTodos = [...todos];
  newTodos.push(todo);
  save(newTodos);
};

const updateTodo = ({ id, title, complete }) => {
  const newTodos = todos.map(todo => {
    if (todo.id === id) {
      const newTodo = { ...todo };
      if (title !== undefined) {
        newTodo.title = title;
      }
      if (complete !== undefined) {
        newTodo.complete = complete;
      }
      return newTodo;
    }
    return todo;
  });
  save(newTodos);
};

const deleteTodo = id => {
  const newTodos = todos.filter(todo => todo.id !== id);
  save(newTodos);
};

const prompt = async (questions, cb, id = null) => {
  const answers = await inquirer.prompt(questions);
  if (id != undefined) answers.id = id;
  cb(answers);
};

const pathObject = {
  addTodo: ({ title }) => addTodo(title),
  editTodo: ({ id, title }) => updateTodo({ id, title }),
  completeTodo: ({ id, complete }) => updateTodo({ id, complete }),
  deleteTodo: ({ confirmDelete, id }) => {
    confirmDelete ? deleteTodo(id) : prompt(questions1, choicesPath);
  },
  showTodos: ({ id }) => prompt(questions2, choicesPath, id),
  mainMenu: () => prompt(questions1, choicesPath),
  quitApp: () => console.log('Good bye!'),
};

const choicesPath = ({ path, ...rest }) => {
  return pathObject[path](rest);
};

const questions1 = [
  {
    type: 'list',
    name: 'path',
    message: 'Please select from the following:',
    choices: [
      { name: 'Create a todo', value: 'addTodo' },
      { name: 'Show all todos', value: 'showTodos' },
      { name: 'Quit app', value: 'quitApp' },
    ],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Describe your todo:',
    when: answers => answers.path === 'addTodo',
  },
  {
    type: 'list',
    name: 'id',
    message: 'Select a todo to make changes:',
    pageSize: 25,
    choices: () => generateChoices(),
    when: answers => answers.path === 'showTodos',
  },
];

const questions2 = [
  {
    type: 'list',
    name: 'path',
    message: 'Please choose one of the following:',
    choices: [
      { name: 'Edit todo', value: 'editTodo' },
      { name: 'Change complete', value: 'completeTodo' },
      { name: 'Delete todo', value: 'deleteTodo' },
      { name: 'Back to menu', value: 'mainMenu' },
    ],
  },
  {
    type: 'input',
    name: 'title',
    message: 'Edit your todo:',
    when: answers => answers.path === 'editTodo',
  },
  {
    type: 'confirm',
    name: 'confirmDelete',
    message: 'Are you sure you want to delete this todo?',
    when: answers => answers.path === 'deleteTodo',
  },
  {
    type: 'confirm',
    name: 'complete',
    message: 'Is this todo complete?',
    when: answers => answers.path === 'completeTodo',
  },
];

loadTodosData();
prompt(questions1, choicesPath);
