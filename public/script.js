document.addEventListener("DOMContentLoaded", () => {

    const taskForm = document.getElementById("taskForm");
    const taskContainer = document.getElementById("taskContainer");
    const priorityFilter = document.getElementById("priorityFilter");

    async function loadTasks(filter = "All") {

        try {

            const response = await fetch("/api/tasks");

            const tasks = await response.json();

            taskContainer.innerHTML = "";

            const filteredTasks = filter === "All"
                ? tasks
                : tasks.filter(task => task.priority === filter);

            if (filteredTasks.length === 0) {

                taskContainer.innerHTML = `
                    <p class="empty-message">
                        No tasks found.
                    </p>
                `;

                return;

            }

            filteredTasks.forEach(task => {

                const card = document.createElement("div");

                card.className = task.completed
                    ? "task-card completed"
                    : "task-card";

                card.innerHTML = `

                    <h3>${task.title}</h3>

                    <p>${task.description}</p>

                    <div class="task-meta">

                        <span>
                            📅 ${task.date}
                        </span>

                        <span class="priority ${task.priority.toLowerCase()}">
                            ${task.priority}
                        </span>

                    </div>

                    <div class="actions">

                        <button
                            class="complete-btn"
                            onclick="toggleComplete('${task._id}')">

                            ${task.completed ? "Completed" : "Mark Complete"}

                        </button>

                        <button
                            class="delete-btn"
                            onclick="removeTask('${task._id}')">

                            Delete

                        </button>

                    </div>

                `;

                taskContainer.appendChild(card);

            });

        }

        catch (error) {

            console.error(error);

        }

    }

    taskForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const task = {

            title: document.getElementById("taskTitle").value,

            description: document.getElementById("taskDescription").value,

            date: document.getElementById("taskDate").value,

            priority: document.getElementById("taskPriority").value,

            completed: false

        };

        await fetch("/api/tasks", {

            method: "POST",

            headers: {

                "Content-Type": "application/json"

            },

            body: JSON.stringify(task)

        });

        taskForm.reset();

        loadTasks(priorityFilter.value);

    });

    priorityFilter.addEventListener("change", () => {

        loadTasks(priorityFilter.value);

    });

    window.removeTask = async (id) => {

        await fetch(`/api/tasks/${id}`, {

            method: "DELETE"

        });

        loadTasks(priorityFilter.value);

    };

    window.toggleComplete = async (id) => {

        await fetch(`/api/tasks/${id}`, {

            method: "PATCH"

        });

        loadTasks(priorityFilter.value);

    };

    loadTasks();

});