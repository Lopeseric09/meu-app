document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const taskCategoryInput = document.getElementById('task-category');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; 

  
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    
    function updateTaskCounter() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = `Tarefas restantes: ${remainingTasks}`;
    }

   
    function addTask(taskText, taskCategory, taskDeadline) {
        const task = {
            text: taskText,
            category: taskCategory,
            deadline: taskDeadline,
            completed: false
        };
        tasks.push(task);
        saveTasksToLocalStorage();
        renderTasks();
    }


    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.innerHTML = `
                <span class="task-text">${task.text}</span>
                <span class="task-category">[${task.category}]</span>
                <span class="task-deadline">Até: ${task.deadline}</span>
            `;
            if (task.completed) {
                taskItem.classList.add('completed');
            }

       
            taskItem.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasksToLocalStorage();
                renderTasks();
            });

            
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remover';
            removeButton.classList.add('remove-task');
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); 
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
                renderTasks();
            });

            taskItem.appendChild(removeButton);
            taskList.appendChild(taskItem);
        });
        updateTaskCounter();
    }

  
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskCategory = taskCategoryInput.value.trim();
        const taskDeadline = taskDeadlineInput.value.trim();

        if (taskText && taskCategory && taskDeadline) {
            addTask(taskText, taskCategory, taskDeadline);
            taskInput.value = ''; 
            taskCategoryInput.value = ''; 
            taskDeadlineInput.value = ''; 
        }
    });

  
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    renderTasks(); 
});
