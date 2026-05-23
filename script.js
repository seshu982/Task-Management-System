const API =
  "http://localhost:3000/api/tasks";

const AUTH =
  "http://localhost:3000/api/auth";

let allTasks = [];



/* REGISTER */

async function register() {

  const name =
    document.getElementById(
      "name"
    ).value;

  const email =
    document.getElementById(
      "email"
    ).value;

  const password =
    document.getElementById(
      "password"
    ).value;

  const response =
    await fetch(

      `${AUTH}/register`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          name,
          email,
          password

        })

      }

    );

  const data =
    await response.json();

  alert(data.message);

}



/* LOGIN */

async function login() {

  const email =
    document.getElementById(
      "email"
    ).value;

  const password =
    document.getElementById(
      "password"
    ).value;

  const response =
    await fetch(

      `${AUTH}/login`,

      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json"

        },

        body: JSON.stringify({

          email,
          password

        })

      }

    );

  const data =
    await response.json();

  if (data.token) {

    localStorage.setItem(
      "token",
      data.token
    );

    document.getElementById(
      "authSection"
    ).style.display = "none";

    document.getElementById(
      "appSection"
    ).style.display = "flex";

    fetchTasks();

  } else {

    alert(data.message);

  }

}



/* FETCH TASKS */

async function fetchTasks() {

  const response =
    await fetch(API);

  const tasks =
    await response.json();

  allTasks = tasks;

  displayTasks(tasks);

  updateStats(tasks);

}



/* DISPLAY TASKS */

function displayTasks(tasks) {

  const taskList =
    document.getElementById(
      "taskList"
    );

  taskList.innerHTML = "";

  tasks.forEach((task) => {

    taskList.innerHTML += `

      <div class="task-card">

        <h3>
          ${task.title}
        </h3>

        <p>
          ${task.description}
        </p>

        <p>
          Priority:
          <span class="
            ${task.priority.toLowerCase()}
          ">
            ${task.priority}
          </span>
        </p>

        <p class="
          ${
            task.status ===
            "Completed"

            ? "completed"

            : "pending"
          }
        ">

          ${task.status}

        </p>


        <button
          class="toggle-btn"
          onclick="
            toggleStatus(
              '${task._id}',
              '${task.status}'
            )
          "
        >
          Toggle
        </button>


        <button
          class="edit-btn"
          onclick="
            editTask(
              '${task._id}',
              '${task.title}',
              '${task.description}',
              '${task.priority}'
            )
          "
        >
          Edit
        </button>


        <button
          class="delete-btn"
          onclick="
            deleteTask(
              '${task._id}'
            )
          "
        >
          Delete
        </button>

      </div>

    `;

  });

}



/* ADD TASK */

async function addTask() {

  const title =
    document.getElementById(
      "title"
    ).value;

  const description =
    document.getElementById(
      "description"
    ).value;

  const priority =
    document.getElementById(
      "priority"
    ).value;

  if (
    !title ||
    !description
  ) {

    alert(
      "Please fill all fields"
    );

    return;

  }

  await fetch(API, {

    method: "POST",

    headers: {

      "Content-Type":
        "application/json"

    },

    body: JSON.stringify({

      title,
      description,
      priority,
      status: "Pending"

    })

  });

  document.getElementById(
    "title"
  ).value = "";

  document.getElementById(
    "description"
  ).value = "";

  fetchTasks();

}



/* DELETE TASK */

async function deleteTask(id) {

  await fetch(

    `${API}/${id}`,

    {

      method: "DELETE"

    }

  );

  fetchTasks();

}



/* TOGGLE STATUS */

async function toggleStatus(
  id,
  status
) {

  const task =
    allTasks.find(

      (t) => t._id === id

    );

  const newStatus =

    status === "Pending"

      ? "Completed"

      : "Pending";

  await fetch(

    `${API}/${id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type":
          "application/json"

      },

      body: JSON.stringify({

        title:
          task.title,

        description:
          task.description,

        priority:
          task.priority,

        status:
          newStatus

      })

    }

  );

  fetchTasks();

}



/* EDIT TASK */

async function editTask(
  id,
  oldTitle,
  oldDescription,
  oldPriority
) {

  const title =
    prompt(
      "Edit Title",
      oldTitle
    );

  const description =
    prompt(
      "Edit Description",
      oldDescription
    );

  const priority =
    prompt(
      "Edit Priority",
      oldPriority
    );

  await fetch(

    `${API}/${id}`,

    {

      method: "PUT",

      headers: {

        "Content-Type":
          "application/json"

      },

      body: JSON.stringify({

        title,
        description,
        priority

      })

    }

  );

  fetchTasks();

}



/* SEARCH TASKS */

function searchTasks() {

  const value =

    document
      .getElementById(
        "search"
      )
      .value
      .toLowerCase();

  const filtered =

    allTasks.filter(

      (task) =>

        task.title
          .toLowerCase()
          .includes(value)

    );

  displayTasks(filtered);

}



/* FILTER TASKS */

function filterTasks(status) {

  if (status === "All") {

    displayTasks(allTasks);

    return;

  }

  const filteredTasks =

    allTasks.filter(

      (task) =>

        task.status === status

    );

  displayTasks(filteredTasks);

}



/* UPDATE STATS */

function updateStats(tasks) {

  document.getElementById(
    "totalTasks"
  ).innerText =
    tasks.length;

  document.getElementById(
    "completedTasks"
  ).innerText =

    tasks.filter(

      (t) =>
        t.status ===
        "Completed"

    ).length;

  document.getElementById(
    "pendingTasks"
  ).innerText =

    tasks.filter(

      (t) =>
        t.status ===
        "Pending"

    ).length;

}



/* DARK MODE */

function toggleDarkMode() {

  document.body.classList.toggle(
    "dark-mode"
  );

}

/* LOGOUT */

function logout() {

  localStorage.removeItem(
    "token"
  );

  document.getElementById(
    "appSection"
  ).style.display = "none";

  document.getElementById(
    "authSection"
  ).style.display = "flex";

}

/* AUTO LOGIN */

window.onload = () => {

  const token =
    localStorage.getItem(
      "token"
    );

  if (token) {

    document.getElementById(
      "authSection"
    ).style.display = "none";

    document.getElementById(
      "appSection"
    ).style.display = "flex";

    fetchTasks();

  }

};