
const form = document.getElementById('todoform');
const todoInput = document.getElementById('newtodo');
const todosListEl = document.getElementById('todos-list');
const notificationEl = document.querySelector('.notification');


let todos = JSON.parse(localStorage.getItem('todos')) || [];
let EditTodoId = -1;

renderTodos();


form.addEventListener('submit', function (event) {
  event.preventDefault();

  saveTodo();
  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
});

function saveTodo() {
  const todoValue = todoInput.value;
  const isEmpty = todoValue === '';

  const isDuplicate = todos.some((todo) => todo.value.toUpperCase() === todoValue.toUpperCase());

  if (isEmpty) {
    showNotification("Hey!!! Enter Something");
  } else if (isDuplicate) {
    showNotification('You are trying to do the same task again.');
  } else {
    if (EditTodoId >= 0) {
      todos = todos.map((todo, index) => ({
        ...todo,
        value: index === EditTodoId ? todoValue : todo.value,
      }));
      EditTodoId = -1;
    } else {
      todos.push({
        value: todoValue,
        checked: false,
        color: '#' + Math.floor(Math.random() * 16777215).toString(16),
      });
    }

    todoInput.value = '';
  }
}

function renderTodos() {
  if (todos.length === 0) {
    todosListEl.innerHTML = '<center>YOU ARE FREE TO WATCH A MOVIE!!!</center>';
    return;
  }

  todosListEl.innerHTML = '';

  todos.forEach((todo, index) => {
    todosListEl.innerHTML += `
    <div class="todo" id=${index}>
      <i 
        class="bi ${todo.checked ? 'bi-check-circle-fill' : 'bi-circle'}"
        style="color : ${todo.color}"
        data-action="check"
      ></i>
      <p class="${todo.checked ? 'checked' : ''}" data-action="check">${todo.value}</p>
      <i class="bi bi-pencil-square" data-action="edit"></i>
      <i class="bi bi-trash" data-action="delete"></i>
    </div>
    `;
  });
}

todosListEl.addEventListener('click', (event) => {
  const target = event.target;
  const parentElement = target.parentNode;

  if (parentElement.className !== 'todo') return;

  const todo = parentElement;
    const todoId = Number(todo.id);
  const action = target.dataset.action;
  action === 'check' && checkTodo(todoId);
  action === 'edit' && editTodo(todoId);
    action === 'delete' && deleteTodo(todoId);
        if (todoId > 1) {
            return document.getElementById("completed").innerText = "Task " + todoId + " also Completed";
        }
        else {
            return document.getElementById("completed").innerText = "Task " + todoId + " Completed";
        }

});
function checkTodo(todoId) {
  todos = todos.map((todo, index) => ({
    ...todo,
    checked: index === todoId ? !todo.checked : todo.checked,
  }));

  renderTodos();
    localStorage.setItem('todos', JSON.stringify(todos));
}

function editTodo(todoId) {
  todoInput.value = todos[todoId].value;
  EditTodoId = todoId;
}

function deleteTodo(todoId) {
  todos = todos.filter((todo, index) => index !== todoId);
  EditTodoId = -1;

  renderTodos();
  localStorage.setItem('todos', JSON.stringify(todos));
}
function showNotification(msg) {
  notificationEl.innerHTML = msg;

  notificationEl.classList.add('notif-enter');
  setTimeout(() => {
    notificationEl.classList.remove('notif-enter');
  }, 2000);
}
