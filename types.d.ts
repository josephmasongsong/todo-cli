type Todo = {
  id: string;
  title: string;
  complete: boolean;
};

type Answers = {
  title?: string;
  id?: string;
  confirmDelete?: boolean;
  complete?: boolean;
} & {
  path: string;
}

type Choices = { name: string; value: string }[];

type When = (answers: Answers) => void;

type QuestionObjectKey =
  | 'type'
  | 'name'
  | 'message'
  | 'pageSize'
  | 'choices'
  | 'when';

type Question = {
  [key in QuestionObjectKey]?: string | number | Choices | When;
};

type PathObjectKey =
  | 'addTodo'
  | 'editTodo'
  | 'completeTodo'
  | 'deleteTodo'
  | 'showTodos'
  | 'mainMenu'
  | 'quitApp';

type PathObject = {
  [key in PathObjectKey]: (...args: any[]) => void;
};
