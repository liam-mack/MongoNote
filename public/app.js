const actionBtn = document.getElementById("actionButton");
// new item
const makeNote = document.getElementById("makeNew");
// clear all items
const clear = document.getElementById("clearAll");
// delete an item
const results = document.getElementById("results");

const status = document.getElementById("status");

function getResults() {
    clearTodos();
    fetch("/all")
        .then(function(response) {
            if (response.status !== 200) {
                console.log("Looks like there was a problem. Status Code: " + response.status);
                return;
            }
            response.json().then(function(data) {
                newTodoSnippet(data);
            });
        })
        .catch(function(err) {
            console.log("Fetch Error :-S", err);
        });
}

function newTodoSnippet(res) {
    for (var i = 0; i < res.length; i++) {
        let data_id = res[i]["_id"];
        let title = res[i]["title"];
        let todoList = document.getElementById("results");
        snippet = `
      <p class="data-entry">
      <span class="dataTitle" data-id=${data_id}>${title}</span>
      <span onClick="delete" class="delete" data-id=${data_id}>x</span>;
      </p>`;
        todoList.insertAdjacentHTML("beforeend", snippet);
    }
}

function clearTodos() {
    const todoList = document.getElementById("results");
    todoList.innerHTML = "";
}

function resetTitleAndNote() {
    const note = document.getElementById("note");
    note.value = "";
    const title = document.getElementById("title");
    title.value = "";
}

function updateTitleAndNote(data) {
    const note = document.getElementById("note");
    note.value = data.note;
    const title = document.getElementById("title");
    title.value = data.title;
}

getResults();

clear.addEventListener("click", function(e) {
    if (e.target.matches("#clearAll")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/clearall", {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                clearTodos();
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

results.addEventListener("click", function(e) {
    if (e.target.matches(".delete")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/delete/" + data_id, {
                method: "delete"
            })
            .then(function(response) {
                if (response.status !== 200) {
                    console.log("Looks like there was a problem. Status Code: " + response.status);
                    return;
                }
                element.parentNode.remove();
                resetTitleAndNote();
                let newButton = `
      <button id='makeNew'>Submit</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches(".dataTitle")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        status.innerText = "Editing"
        fetch("/find/" + data_id, { method: "get" })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                updateTitleAndNote(data);
                let newButton = `<button id='updater' data-id=${data_id}>Update</button>`;
                actionBtn.innerHTML = newButton;
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    }
});

actionBtn.addEventListener("click", function(e) {
    if (e.target.matches("#updater")) {
        updateBtnEl = e.target;
        data_id = updateBtnEl.getAttribute("data-id");
        const title = document.getElementById("title").value;
        const note = document.getElementById("note").value;
        fetch("/update/" + data_id, {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title,
                    note
                })
            })
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                element.innerText = title
                resetTitleAndNote();
                let newButton = `<button id='makeNew'>Submit</button>`;
                actionBtn.innerHTML = newButton;
                status.innerText = "Creating"
            })
            .catch(function(err) {
                console.log("Fetch Error :-S", err);
            });
    } else if (e.target.matches("#makeNew")) {
        element = e.target;
        data_id = element.getAttribute("data-id");
        fetch("/submit", {
                method: "post",
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: document.getElementById("title").value,
                    note: document.getElementById("note").value,
                    created: Date.now()
                })
            })
            .then(res => res.json())
            .then(res => newTodoSnippet([res]));
        resetTitleAndNote();
    }
});

// Change font on user selection
function fontSelect() {

    const input = document.getElementById("fonts").value
    
    const title = document.getElementById("title")
    const note = document.getElementById("note")
    const results = document.getElementById("results")
  
    switch(input) {
      case "Times": 
        document.body.className = "";
        document.body.classList.add("times");
        title.className = "";
        title.classList.add("times");
        note.className = "";
        note.classList.add("times");
        results.className = "";
        results.classList.add("times");

    
  
        break;
      case "Impact":
        document.body.className = "";
        document.body.classList.add("impact");
        title.className = "";
        title.classList.add("impact");
        note.className = "";
        note.classList.add("impact");
        results.className = "";
        results.classList.add("impact");
  
        break;
      case "Cursive":
        document.body.className = "";
        document.body.classList.add("cursive");
        title.className = "";
        title.classList.add("cursive");
        note.className = "";
        note.classList.add("cursive");
        results.className = "";
        results.classList.add("cursive");
  
        break;
      case "Typewriter":
        document.body.className = "";
        document.body.classList.add("typewriter");
        title.className = "";
        title.classList.add("typewriter");
        note.className = "";
        note.classList.add("typewriter");
        results.className = "";
        results.classList.add("typewriter");
  
        break;
    }
  }
  