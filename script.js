document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('new-task');
    const taskCategoryInput = document.getElementById('task-category');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const taskCounter = document.getElementById('task-counter');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || []; // Carrega as tarefas do localStorage

    // Função para salvar tarefas no localStorage
    function saveTasksToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Função para atualizar o contador de tarefas restantes
    function updateTaskCounter() {
        const remainingTasks = tasks.filter(task => !task.completed).length;
        taskCounter.textContent = `Tarefas restantes: ${remainingTasks}`;
    }

    // Função para adicionar uma nova tarefa
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

    // Função para renderizar as tarefas na tela
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

            // Marcar a tarefa como concluída ao clicar nela
            taskItem.addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasksToLocalStorage();
                renderTasks();
            });

            // Botão para remover a tarefa
            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remover';
            removeButton.classList.add('remove-task');
            removeButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que o clique no botão remova a tarefa
                tasks.splice(index, 1);
                saveTasksToLocalStorage();
                renderTasks();
            });

            taskItem.appendChild(removeButton);
            taskList.appendChild(taskItem);
        });
        updateTaskCounter();
    }

    // Adiciona tarefa ao clicar no botão
    addTaskButton.addEventListener('click', () => {
        const taskText = taskInput.value.trim();
        const taskCategory = taskCategoryInput.value.trim();
        const taskDeadline = taskDeadlineInput.value.trim();

        if (taskText && taskCategory && taskDeadline) {
            addTask(taskText, taskCategory, taskDeadline);
            taskInput.value = ''; // Limpa o campo de entrada
            taskCategoryInput.value = ''; // Limpa o campo de categoria
            taskDeadlineInput.value = ''; // Limpa o campo de prazo
        }
    });

    // Adiciona tarefa ao pressionar 'Enter'
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTaskButton.click();
        }
    });

    renderTasks(); // Renderiza as tarefas ao carregar a página
});
