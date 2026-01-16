let addbtn = document.getElementById("add-btn");
let todoList = document.querySelector(".todo-list");
let form = document.querySelector(".full-card");
let taskbtn = document.getElementById("but1");
let indata = document.getElementById("input-data");
let closebtn = document.getElementById("but2");
let finish = document.getElementsByClassName("finish");
let fullview = document.querySelector(".full-view");
let cardview = document.querySelector(".card-view");
let text_title = document.querySelector("#view-title-text");
let text_content = document.querySelector("#view-content-text");
let selectedCard = null;
let selectedTodoId = null;
const compViewBtn = document.querySelector(".comp-view");

indata.addEventListener("submit", (e) => {
  e.preventDefault();

  let title = document.getElementById("title-textarea").value;
  let content = document.getElementById("content-textarea").value;

  let todo = {
    id: Date.now(),
    title,
    content,
  };

  let todos = getTodos();
  todos.push(todo);
  saveTodos(todos);

  let card = createCard(todo);
  todoList.insertBefore(card, document.getElementById("add-card"));

  indata.reset();
  form.classList.add("hide");
});

addbtn.addEventListener("click", () => {
  form.classList.remove("hide");
});

window.addEventListener("DOMContentLoaded", () => {
  getTodos().forEach((todo) => {
    let card = createCard(todo);
    todoList.insertBefore(card, document.getElementById("add-card"));
  });
});

closebtn.addEventListener("click", () => {
  form.classList.add("hide");
});

function getTodos() {
  return JSON.parse(localStorage.getItem("todos")) || [];
}

function saveTodos(todos) {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function deleteTodo(id, card) {
  // remove from localStorage
  let todos = getTodos().filter((todo) => todo.id !== id);
  saveTodos(todos);

  // remove from DOM
  card.remove();
}

function truncatetitle(text, maxLength = 24) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
}

function truncatecont(text, maxLength = 120) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength) + "..";
  }
  return text;
}

function createCard(todo) {
  let card = document.createElement("div");
  card.className = "todo-display flex column";
  card.dataset.id = todo.id; // store id on DOM

  // use truncate for preview
  card.innerHTML = `
        <div class="display-title roboto-slab">${truncatetitle(
          todo.title
        )}</div>
        <div class="display-content roboto">${truncatecont(todo.content)}</div>
        <button class="finish roboto">Completed</button>
    `;

  // finish button logic
  card.querySelector(".finish").addEventListener("click", () => {
    deleteTodo(todo.id, card);
  });

  // on hover, show full text in fullview
  card.querySelector(".display-content").addEventListener("mouseenter", () => {
    selectedCard = card;
    selectedTodoId = todo.id;

    fullview.classList.remove("hide");
    text_title.value = todo.title;
    text_content.value = todo.content;
  });

  cardview.addEventListener("mouseleave", () => {
    fullview.classList.add("hide");
  });

  return card;
}

compViewBtn.addEventListener("click", () => {
  if (!selectedCard || !selectedTodoId) return;

  deleteTodo(selectedTodoId, selectedCard);
  fullview.classList.add("hide");

  selectedCard = null;
  selectedTodoId = null;
});
