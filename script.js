const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const taskCount = document.getElementById("taskCount");
const clearCompleted = document.getElementById("clearCompleted");
const filters = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("themeToggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let filter = "all";

/* =====================
   THEME TOGGLE
===================== */
const toggle = document.getElementById("themeToggle");

toggle.addEventListener("click", () => {
  const body = document.body;
  const isDark = body.getAttribute("data-theme") === "dark";

  body.setAttribute("data-theme", isDark ? "light" : "dark");

  // optional: remember theme
  localStorage.setItem("theme", isDark ? "light" : "dark");
});

// load saved theme
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.setAttribute("data-theme", savedTheme);
}


/* =====================
   STORAGE
===================== */
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/* =====================
   RENDER
===================== */
function render() {
  todoList.innerHTML = "";

  const filteredTodos = todos.filter(todo => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  filteredTodos.forEach((todo, index) => {
    const li = document.createElement("li");
    li.className = todo.completed ? "completed" : "";

    /* CHECKBOX */
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;

    checkbox.onchange = () => {
      todo.completed = checkbox.checked;
      render();
    };

    /* TEXT */
    const span = document.createElement("span");
    span.textContent = todo.text;

    // Edit on double click
    span.ondblclick = () => editTodo(span, index);

    /* DELETE */
    const del = document.createElement("button");
    del.textContent = "✖";

    del.onclick = () => {
      li.classList.add("removing");
      setTimeout(() => {
        todos.splice(index, 1);
        render();
      }, 400);
    };

    li.append(checkbox, span, del);
    todoList.appendChild(li);
  });

  taskCount.textContent = `${todos.length} Tasks`;
  save();
}

/* =====================
   ADD TODO
===================== */
todoForm.onsubmit = e => {
  e.preventDefault();

  if (todoInput.value.trim() === "") return;

  todos.push({
    text: todoInput.value.trim(),
    completed: false
  });

  todoInput.value = "";
  render();
};

/* =====================
   EDIT TODO
===================== */
function editTodo(span, index) {
  const input = document.createElement("input");
  input.type = "text";
  input.value = todos[index].text;

  span.replaceWith(input);
  input.focus();

  input.onblur = () => {
    todos[index].text =
      input.value.trim() || todos[index].text;
    render();
  };

  input.onkeydown = e => {
    if (e.key === "Enter") input.blur();
  };
}

/* =====================
   FILTERS
===================== */
filters.forEach(btn => {
  btn.onclick = () => {
    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    filter = btn.dataset.filter;
    render();
  };
});

/* =====================
   CLEAR COMPLETED
===================== */
clearCompleted.onclick = () => {
  todos = todos.filter(todo => !todo.completed);
  render();
};

/* =====================
   INIT
===================== */
render();
