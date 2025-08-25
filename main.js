let input = document.querySelector(".input");
let submit = document.querySelector(".add");
let tasksDiv = document.querySelector(".tasks");
let searchInput = document.getElementById("search");
let filterButtons = document.querySelectorAll(".filter-btn");
let clearAllBtn = document.getElementById("clear-all");
let taskCount = document.getElementById("task-count");
let completedCount = document.getElementById("completed-count");
let progressBar = document.getElementById("progress");
let modeToggle = document.getElementById("mode-toggle");

let arrayOfTasks = JSON.parse(localStorage.getItem("tasks")) || [];
if (localStorage.getItem("mode") === "dark") {
  document.body.classList.add("dark");
  modeToggle.textContent = document.body.classList.contains("dark")
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
}
renderTasks(arrayOfTasks);

// Add Task
submit.onclick = function () {
  if (input.value.trim() !== "") {
    addTask(input.value.trim());
    input.value = "";
  }
};

// Search
searchInput.addEventListener("keyup", function () {
  let term = searchInput.value.toLowerCase();
  let filtered = arrayOfTasks.filter((t) =>
    t.title.toLowerCase().includes(term)
  );
  renderTasks(filtered);
});

// Filters
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    filterTasks(btn.dataset.filter);
  });
});

// Clear All
clearAllBtn.onclick = function () {
  arrayOfTasks = [];
  updateStorage();
  renderTasks(arrayOfTasks);
};

// Toggle Dark Mode
modeToggle.onclick = function () {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark"))
    window.localStorage.setItem("mode", "dark");
  else {
    window.localStorage.setItem("mode", "light");
  }
  modeToggle.textContent = document.body.classList.contains("dark")
    ? "☀ Light Mode"
    : "🌙 Dark Mode";
};

// Add Task Function
function addTask(taskText) {
  const task = {
    id: Date.now(),
    title: taskText,
    completed: false,
  };
  arrayOfTasks.push(task);
  updateStorage();
  renderTasks(arrayOfTasks);
}

// Render Tasks
function renderTasks(tasks) {
  tasksDiv.innerHTML = "";
  tasks.forEach((task) => {
    let div = document.createElement("div");
    div.className = "task";
    if (task.completed) div.classList.add("done");
    div.setAttribute("data-id", task.id);

    let title = document.createElement("span");
    title.textContent = task.title;

    let buttons = document.createElement("div");

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => editTask(task.id);

    let delBtn = document.createElement("span");
    delBtn.textContent = "Delete";
    delBtn.className = "del";
    delBtn.onclick = () => deleteTask(task.id);

    div.onclick = (e) => {
      if (
        e.target.classList.contains("edit") ||
        e.target.classList.contains("del")
      )
        return;
      toggleTask(task.id);
    };

    buttons.appendChild(editBtn);
    buttons.appendChild(delBtn);
    div.appendChild(title);
    div.appendChild(buttons);
    tasksDiv.appendChild(div);
  });

  updateStats();
}

// Edit Task
function editTask(id) {
  let task = arrayOfTasks.find((t) => t.id === id);
  let newTitle = prompt("Edit task:", task.title);
  if (newTitle !== null && newTitle.trim() !== "") {
    task.title = newTitle.trim();
    updateStorage();
    renderTasks(arrayOfTasks);
  }
}

// Delete Task
function deleteTask(id) {
  arrayOfTasks = arrayOfTasks.filter((t) => t.id !== id);
  updateStorage();
  renderTasks(arrayOfTasks);
}

// Toggle Status
function toggleTask(id) {
  arrayOfTasks.forEach((t) => {
    if (t.id === id) t.completed = !t.completed;
  });
  updateStorage();
  renderTasks(arrayOfTasks);
}

// Filter Tasks
function filterTasks(type) {
  if (type === "all") renderTasks(arrayOfTasks);
  else if (type === "completed")
    renderTasks(arrayOfTasks.filter((t) => t.completed));
  else renderTasks(arrayOfTasks.filter((t) => !t.completed));
}

// Update LocalStorage
function updateStorage() {
  localStorage.setItem("tasks", JSON.stringify(arrayOfTasks));
}

// Update Stats
function updateStats() {
  taskCount.textContent = arrayOfTasks.length;
  completedCount.textContent = arrayOfTasks.filter((t) => t.completed).length;
  let percent =
    arrayOfTasks.length === 0
      ? 0
      : (completedCount.textContent / arrayOfTasks.length) * 100;
  progressBar.style.width = percent + "%";
}
