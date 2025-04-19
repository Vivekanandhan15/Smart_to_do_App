let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

const taskInput = document.getElementById('task');
const priorityInput = document.getElementById('priority');
const addTaskBtn = document.getElementById('addTask');
const taskListUL = document.getElementById('taskList');
const searchInput = document.getElementById('search');
const filterButtons = document.querySelectorAll('.filter-btn');

let currentFilter = 'All';
let searchTerm = '';

addTaskBtn.addEventListener('click', () => {
  const taskText = taskInput.value.trim();
  const priority = priorityInput.value;

  if (taskText === '') {
    alert('Please enter a task.');
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    priority: priority
  };

  taskList.push(task);
  taskInput.value = '';
  saveAndRender();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    currentFilter = btn.getAttribute('data-filter');
    renderTasks(taskList);
  });
});

searchInput.addEventListener('input', () => {
  searchTerm = searchInput.value.toLowerCase();
  renderTasks(taskList);
});

function deleteTask(id) {
  taskList = taskList.filter(task => task.id !== id);
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem('tasks', JSON.stringify(taskList));
  renderTasks(taskList);
}

function renderTasks(tasks) {
  taskListUL.innerHTML = '';

  const filtered = tasks.filter(task => {
    const matchesFilter = currentFilter === 'All' || task.priority === currentFilter;
    const matchesSearch = task.text.toLowerCase().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  if (filtered.length === 0) {
    taskListUL.innerHTML = '<li>No matching tasks found.</li>';
    return;
  }

  filtered.forEach(task => {
    const li = document.createElement('li');
    li.classList.add(task.priority.toLowerCase());
    li.innerHTML = `
      <span>${task.text} - <strong>${task.priority}</strong></span>
      <button class="delete-btn" onclick="deleteTask(${task.id})">X</button>
    `;
    taskListUL.appendChild(li);
  });
}

// Initial render
renderTasks(taskList);