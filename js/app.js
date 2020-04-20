function initTask() {
  // Get All Event Items
  const newTaskForm = document.querySelector("#addTask");
  //	const addToTasksBtn = document.querySelector('#addToTasks');
  //	const addToFolderBtn = document.querySelector('#addToFolder');
  const create = document.querySelector("#createFolder");
  const addFolderBtn = document.querySelector("#createFolderBtn");
  const btn = document.querySelectorAll(".btn");
  const deleteAll = document.getElementById("clearTasks");
  const inputField = document.querySelectorAll(".cleanInput");
  const newTask = document.addTask.newTaskValue;
  const newFolder = document.createFolder.newFolderValue;
  const selectFolder = document.selectFolder.selectFolderValue;
  const filter = document.filter.filterValue;
  const tasks = document.querySelector("#tasks");
  const addToFolderForm = document.querySelector("#selectFolder");
  const selectCancelBtn = document.querySelector("#selectCancel");
  const newTaskIcon = document.querySelector("#newTaskIcon");
  const newFolderIcon = document.querySelector("#newFolderIcon");
  const newEntry = document.querySelector("#newEntry");
  const newFolderEntry = document.querySelector(".newFolder");
  const newTaskEntry = document.querySelector(".newTask");
  const exitIcon = document.querySelector(".fa-times-circle");

  let putInFolder;
  let trash;
  let timeStamp = 0;
  let timeStampRelease = 0;

  /*****************************************COSMETIC************************************************/

  //Changes the color of page title and side background when any input field is selected

  inputField.forEach((input) => {
    input.addEventListener("focus", function () {
      document.getElementById("siteTitle").style.color = "var(--process-color)";
      document.querySelector(".wrapper").style.backgroundColor =
        "var(--process-color)";
    });
    input.addEventListener("blur", function () {
      document.getElementById("siteTitle").style.color = "white";
      document.querySelector(".wrapper").style.backgroundColor =
        "var(--bg-dark)";
    });
  });

  //changes the color of page title and side background when any of the buttons below are hovered

  btn.forEach((button) => {
    button.addEventListener("mouseover", function () {
      if (button.id == "selectCancel") {
        document.getElementById("siteTitle").style.color = "red";
        document.querySelector(".wrapper").style.backgroundColor = "red";
      } else {
        document.getElementById("siteTitle").style.color =
          "var(--active-color)";
        document.querySelector(".wrapper").style.backgroundColor =
          "var(--active-color)";
      }
      document.querySelector("#tasks").classList.add("tasksShadowAddTask");
      button.style.color = "white";
      button.style.color = "white";
    });
    button.addEventListener("mouseout", function () {
      document.getElementById("siteTitle").style.color = "white";
      document.querySelector("#tasks").classList.remove("tasksShadowAddTask");
      document.querySelector(".wrapper").style.backgroundColor =
        "var(--bg-dark)";
    });
  });
  addFolderBtn.addEventListener("mouseover", function () {
    tasks.classList.add("tasksShadowAddFolder");
    document.getElementById("siteTitle").style.color = "var(--inactive-color)";
    //		addFolderBtn.style.color = "white";
    document.querySelector(".wrapper").style.backgroundColor =
      "var(--inactive-color)";
  });
  addFolderBtn.addEventListener("mouseout", function () {
    tasks.classList.remove("tasksShadowAddFolder");
    document.querySelector(".wrapper").style.backgroundColor = "var(--bg-dark)";
    document.getElementById("siteTitle").style.color = "white";
  });
  deleteAll.addEventListener("mouseover", function () {
    tasks.classList.add("tasksShadowDelete");
    document.querySelector(".wrapper").style.backgroundColor = "#FF3034";
    document.querySelector("#siteTitle").style.color = "#FF3034";
    //		document.querySelector('#siteTitle').classList.toggle('tasksShadowDelete');
  });
  deleteAll.addEventListener("mouseout", function () {
    tasks.classList.remove("tasksShadowDelete");
    document.querySelector(".wrapper").style.backgroundColor = "var(--bg-dark)";
    document.getElementById("siteTitle").style.color = "white";
    //		document.querySelector('#siteTitle').classList.toggle('tasksShadowDelete');
  });

  /****************************s*************LOAD ALL TASKS************************************************/

  //gets all folders from localStorage and renders them to the screen
  if (localStorage.getItem("folders") !== null) {
    const loadedFolders = JSON.parse(localStorage.getItem("folders"));
    loadedFolders.forEach((folder) => {
      let li = document.createElement("li");
      li.textContent = folder;
      li.textContent = li.textContent.replace(
        li.textContent[0],
        li.textContent[0].toUpperCase()
      );
      li.innerHTML =
        li.textContent + '<i class="fas fa-trash-alt trashBin"></i>';
      li.className = "folder";
      folderDragListeners(li);
      tasks.appendChild(li);
    });
    let allFolders = document.querySelectorAll(".folder");
    let storageItems = [];
    for (let i = 0; localStorage.key(i) !== null; i++) {
      storageItems.push(localStorage.key(i));
      console.log(localStorage.key(i) + i);
    }
    allFolders.forEach((renderedFolder) => {
      storageItems.forEach((storedFolderTasksKey, w) => {
        if (
          renderedFolder.textContent.toLowerCase() ===
          storedFolderTasksKey.toLowerCase()
        ) {
          let item = localStorage.getItem(storedFolderTasksKey);
          let parsedItem = JSON.parse(item);
          parsedItem.forEach((item) => {
            let li = document.createElement("li");
            li.innerHTML = item + '<i class="fas fa-trash-alt trashBin"></i>';
            li.className = "folder-item f hide";
            //							dragStartAndEnd(li);
            renderedFolder.appendChild(li);
          });
        }
      });
    });
  }

  //gets all tasks from localStorage and renders them to the screen
  if (localStorage.getItem("tasks") !== null) {
    let loadedTasks = JSON.parse(localStorage.getItem("tasks"));
    loadedTasks.forEach((task) => {
      let li = document.createElement("li");
      li.innerHTML =
        task +
        '<i class="fas fa-folder-plus putInFolder"></i><i class="fas fa-trash-alt trashBin"></i>';
      li.className = "task f";
      dragStartAndEnd(li);
      tasks.appendChild(li);
    });
  }

  //Compares completed tasked in localStorage to rendered tasks and then changes styling of completed rendered tasks
  if (localStorage.getItem("completed")) {
    let storedCompleted = JSON.parse(localStorage.getItem("completed"));
    let folderTasks = document.querySelectorAll(".folder-item");
    let tasks = document.querySelectorAll(".task");
    folderTasks.forEach((task) => {
      if (storedCompleted.includes(task.textContent)) {
        task.classList.add("completed");
      }
    });
    tasks.forEach((task) => {
      if (storedCompleted.includes(task.textContent)) {
        task.classList.add("completed");
      }
    });
  }

  /*****************************************EVENTS************************************************/

  //Displays a popup modal to add new task when task icon is clicked
  newTaskIcon.addEventListener("click", showNewTaskForm);
  //Displays a popup modal to add new folder when folder icon is clicked
  newFolderIcon.addEventListener("click", showNewFolderForm);
  //closes or hides popup modal
  exitIcon.addEventListener("click", hide);
  //adds new task to the task list and saves it localStorage
  newTaskForm.addEventListener("submit", function (e) {
    if (newTask.value != "") {
      let li = document.createElement("li");
      li.setAttribute("draggable", "true");
      li.innerHTML =
        newTask.value.trim() +
        '<i class="fas fa-folder-plus putInFolder"></i><i class="fas fa-trash-alt trashBin"></i>';
      li.className = "task f";
      dragStartAndEnd(li);
      tasks.appendChild(li);
      getAndStoreTasks();
    } else {
      alert("Please Type Something!");
    }
    newTask.value = "";
    e.preventDefault();
  });
  addToFolderForm.addEventListener("submit", function (e) {
    let folders = document.querySelectorAll(".folder");
    let newFolderItem = document.querySelector(".newFolderItem");
    let confirmed;
    folders.forEach((folder) => {
      if (folder.innerText.toLowerCase() === selectFolder.value.toLowerCase()) {
        newFolderItem.className += " folder-item f";
        folder.appendChild(newFolderItem);
        addToFolderForm.style.display = "none";
        getAndStoreFolderItems(folder);
        confirmed = true;
      }
    });
    if (confirmed) {
      newFolderItem.removeAttribute("draggable");
      newFolderItem.classList.remove("newFolderItem", "putInFolder", "task");
      newTask.value = "";
      selectFolder.value = "";
      getAndStoreTasks();
    } else {
      alert("No Folder Found.");
    }

    e.preventDefault();
  });
  selectCancelBtn.addEventListener("click", function (e) {
    let newFolderItem = document.querySelector(".newFolderItem");
    document.getElementById("selectFolderValue").value = "";
    document.getElementById("selectFolder").style.display = "none";
    newFolderItem.classList.remove("newFolderItem");
    e.preventDefault();
  });
  create.addEventListener("submit", function (e) {
    if (newFolder.value != "") {
      let li = document.createElement("li");
      li.textContent = newFolder.value;
      li.textContent.trim();
      li.textContent = li.textContent.replace(
        li.textContent[0],
        li.textContent[0].toUpperCase()
      );
      li.innerHTML =
        li.textContent + '<i class="fas fa-trash-alt trashBin"></i>';
      li.className = "folder";
      folderDragListeners(li);
      tasks.appendChild(li);
      saveFolders();
    } else {
      alert("Please Type Something!");
    }
    newFolder.value = "";
    e.preventDefault();
  });
  tasks.addEventListener("mouseover", function () {
    let folders = document.querySelectorAll(".folder");
    let folderItems = document.querySelectorAll(".folder-item");
    if (folderItems) {
      show(folders, folderItems);
    }
    putInFolder = document.querySelectorAll(".putInFolder");
    trash = document.querySelectorAll(".trashBin");
    for (let trashes of trash) {
      trashes.addEventListener("click", function (e) {
        e.stopPropagation();
        let parent = trashes.parentNode;
        if (parent.classList.contains("task")) {
          if (parent.parentNode) {
            parent.parentNode.removeChild(parent);
            getAndStoreTasks();
          }

          //					let storedTasks = JSON.parse(localStorage.getItem('tasks'));
          //					for(let w = 0; w < storedTasks.length; w++){
          //						let loweredContent = parent.textContent.toLowerCase();
          //						let loweredST = storedTasks[w].toLowerCase();
          //						if (loweredContent.includes(loweredST)){
          //							storedTasks.splice(w, 1);
          //							localStorage.setItem('tasks', JSON.stringify(storedTasks));
          //						}
          //					}
        } else if (parent.classList.contains("folder")) {
          let storedFolders = JSON.parse(localStorage.getItem("folders"));
          for (let w = 0; w < storedFolders.length; w++) {
            let loweredContent = parent.textContent.toLowerCase();
            let loweredSF = storedFolders[w].toLowerCase();
            if (loweredContent.includes(loweredSF)) {
              localStorage.removeItem(storedFolders[w]);
              storedFolders.splice(w, 1);
              localStorage.setItem("folders", JSON.stringify(storedFolders));
            }
          }
        } else if (parent.classList.contains("folder-item")) {
          if (parent.parentNode) {
            let folderName = parent.parentNode.firstChild.textContent;
            let folderItemName = parent.firstChild.textContent;
            let storageItems = [];
            for (let i = 0; i < localStorage.length; i++) {
              storageItems.push(localStorage.key(i));
            }
            for (let i = 0; i < storageItems.length; i++) {
              if (storageItems[i] === folderName) {
                let storedFolderItems = JSON.parse(
                  localStorage.getItem(storageItems[i])
                );
                for (let w = 0; w < storedFolderItems.length; w++) {
                  if (folderItemName === storedFolderItems[w]) {
                    storedFolderItems.splice(folderItemName, 1);
                  }
                }
                localStorage.setItem(
                  storageItems[i],
                  JSON.stringify(storedFolderItems)
                );
              }
            }
          }
        }
        parent.remove();
        document.getElementById("tasks").classList.remove("tasksShadowDelete");
        updateCompletedStorage();
      });
      trashes.addEventListener("mouseover", function () {
        document.getElementById("tasks").classList.add("tasksShadowDelete");
      });
      trashes.addEventListener("mouseout", function () {
        document.getElementById("tasks").classList.remove("tasksShadowDelete");
      });
    }
    for (let i = 0; i < putInFolder.length; i++) {
      putInFolder[i].addEventListener("click", function (e) {
        e.stopPropagation();
        addToFolderForm.style.display = "flex";
        let newFolderItem = putInFolder[i].parentElement;
        newFolderItem.classList.add("newFolderItem");
      });
    }
    for (let folder of folders) {
      folder.addEventListener("dragenter", function (e) {
        e.preventDefault();
      });
      folder.addEventListener("dragover", function (e) {
        e.preventDefault();
      });
      folder.addEventListener("dragleave", function () {});
      folder.addEventListener("drop", function () {});
    }
  });
  tasks.addEventListener("click", function (e) {
    if (e.target.matches("li.task") || e.target.matches("li.folder-item")) {
      e.target.classList.toggle("completed");
    }
    if (localStorage.getItem("completed") !== null) {
      let currentTask = e.target.textContent;
      let completed = localStorage.getItem("completed");
      let completedArray = JSON.parse(completed);
      if (
        completedArray.includes(currentTask) &&
        !e.target.classList.contains("completed")
      ) {
        completedArray.forEach((task, index) => {
          if (currentTask === task) {
            completedArray.splice(index, 1);
          }
        });
      } else if (
        !completedArray.includes(currentTask) &&
        e.target.classList.contains("completed")
      ) {
        completedArray.push(currentTask);
      }
      localStorage.setItem("completed", JSON.stringify(completedArray));
    } else {
      let completed = [];
      completed.push(e.target.textContent);
      localStorage.setItem("completed", JSON.stringify(completed));
    }
  });
  filter.addEventListener("input", function () {
    let all = document.querySelectorAll(".f");
    for (let i = 0; i < all.length; i++) {
      let text = all[i].firstChild.textContent.toLowerCase();
      if (filter.value === "") {
        all[i].classList.remove("hide");
        all[i].classList.remove("show");
      } else if (!text.includes(filter.value.toLowerCase())) {
        all[i].classList.add("hide");
        all[i].classList.remove("show");
      } else if (text.includes(filter.value.toLowerCase())) {
        all[i].classList.remove("hide");
        all[i].classList.add("show");
      }
    }
  });
  deleteAll.addEventListener("click", function () {
    let decision = confirm("ARE YOU SURE?");
    if (decision) {
      localStorage.clear();
      let allTasks = document.querySelectorAll(".task");
      let allFolders = document.querySelectorAll(".folder");
      for (const items of allTasks) {
        tasks.removeChild(items);
      }
      for (const items of allFolders) {
        tasks.removeChild(items);
      }
    }
  });

  /****************************************Functions************************************/

  function show(folders, folderItems) {
    folders.forEach((folder) => {
      if (window.innerWidth > 1024) {
        folder.addEventListener("mouseover", () => {
          folderItems.forEach((folderItem) => {
            if (folderItem.parentElement === folder) {
              folderItem.classList.remove("hide");
            }
          });
        });
        folder.addEventListener("mouseout", () => {
          folderItems.forEach((folderItem) => folderItem.classList.add("hide"));
        });
      }
    });
  }
  function showNewTaskForm() {
    newEntry.classList += " flex";
    newTaskEntry.classList += " flex";
  }
  function showNewFolderForm() {
    newEntry.classList += " flex";
    newFolderEntry.classList += " flex";
  }
  function hide() {
    newEntry.classList.remove("flex");
    newTaskEntry.classList.remove("flex");
    newFolderEntry.classList.remove("flex");
  }
  function getAndStoreTasks() {
    let allTasks = document.querySelectorAll(".task");
    let allTasksArray = [];
    for (let i = 0; i < allTasks.length; i++) {
      allTasksArray.push(allTasks[i].textContent);
    }
    localStorage.setItem("tasks", JSON.stringify(allTasksArray));
  }
  function getAndStoreFolderItems(passFolder) {
    let folderItems = passFolder.querySelectorAll(".folder-item");
    let fIA = [];
    let folderContent = passFolder.innerText.split("\n");
    let folderName = folderContent[0];
    for (let i = 0; i < folderItems.length; i++) {
      fIA.push(folderItems[i].textContent);
    }
    localStorage.setItem(folderName, JSON.stringify(fIA));
  }
  function dragStartAndEnd(li) {
    if (window.innerWidth > 1024) {
      li.setAttribute("draggable", "true");
      li.addEventListener("dragstart", (e) => {
        e.firesTouchEvents = false;
        li.classList.add("movingToFolder");
        setTimeout(() => li.classList.add("hide"), 0);
      });
      li.addEventListener("dragend", () => {
        li.classList.remove("hide");
        li.classList.remove("movingToFolder");
      });
    } else {
      li.addEventListener("touchmove", (e) => {
        e.preventDefault();
      });
      li.addEventListener("touchstart", (e) => {
        let currentTimeStamp = Math.floor(e.timeStamp);
        let tapTime = currentTimeStamp - timeStamp;
        if (tapTime < 300) {
          li.classList.toggle("movingToFolder");
        }
        timeStamp = currentTimeStamp;
      });
    }
  }
  function folderDragListeners(li) {
    li.addEventListener("dragover", (e) => e.preventDefault());
    li.addEventListener("dragenter", (e) => {
      e.preventDefault();
      tasks.classList.add("tasksShadowAddFolder");
    });
    li.addEventListener("dragleave", () =>
      tasks.classList.remove("tasksShadowAddFolder")
    );
    li.addEventListener("drop", () => {
      tasks.classList.remove("tasksShadowAddFolder");
      let dragItem = document.querySelector(".movingToFolder");
      dragItem.classList.remove("task");
      dragItem.classList.add("folder-item");
      if (dragItem.firstElementChild.classList.contains("putInFolder")) {
        dragItem.removeChild(dragItem.firstElementChild);
      }
      li.appendChild(dragItem);
      dragItem.removeAttribute("draggable");
      getAndStoreFolderItems(li);
      getAndStoreTasks();
    });
    if (window.innerWidth < 1024) {
      li.addEventListener("touchstart", (e) => {
        timeStamp = e.timeStamp;
      });
      li.addEventListener("click", (e) => {
        if (!e.target.matches("li.folder-item")) {
          li.classList.toggle("open");
        }
        let folderItems = li.childNodes;
        folderItems.forEach((item) => {
          if (li.classList.contains("open")) {
            if (
              item.classList !== undefined &&
              !e.target.matches("li.folder-item")
            ) {
              item.classList.remove("hide");
            }
          } else {
            if (
              item.classList !== undefined &&
              !e.target.matches("li.folder-item")
            ) {
              item.classList.add("hide");
            }
          }
        });
      });
      li.addEventListener("touchend", (e) => {
        timeStampRelease = e.timeStamp;
        let holdTime = Math.floor(timeStampRelease - timeStamp);
        if (holdTime > 450) {
          li.classList.toggle("open");
          let folderItems = li.childNodes;
          folderItems.forEach((item) => {
            if (
              item.classList !== undefined &&
              !e.target.matches("li.folder-item")
            ) {
              item.classList.add("hide");
            }
          });
          let moving = document.querySelectorAll(".movingToFolder");
          if (moving.length > 0) {
            moving.forEach((move) => {
              let newMove = move.cloneNode(true);
              li.appendChild(newMove);
              newMove.removeChild(newMove.firstElementChild);
              newMove.className = "folder-item f hide";
              newMove.removeAttribute("draggable");
              move.parentElement.removeChild(move);
            });
          }
          getAndStoreFolderItems(li);
          getAndStoreTasks();
        }
      });
    }
  }
  function saveFolders() {
    let folders = document.querySelectorAll(".folder");
    let foldersArray = [];
    for (let i = 0; i < folders.length; i++) {
      foldersArray.push(folders[i].innerText.split("\n").pop());
    }
    console.log(foldersArray);
    localStorage.setItem("folders", JSON.stringify(foldersArray));
  }
  function updateCompletedStorage() {
    if (localStorage.getItem("completed")) {
      let tasks = document.querySelectorAll(".f");
      let tasksArray = [];
      tasks.forEach((task) => tasksArray.push(task.textContent));
      let completed = JSON.parse(localStorage.getItem("completed"));
      completed.forEach((task, index) => {
        if (!tasksArray.includes(task)) {
          completed.splice(index, 1);
        }
      });
      localStorage.setItem("completed", JSON.stringify(completed));
    }
  }
}

//setTimeout(function(){
//	document.getElementById('loader').style.display = 'none';
//}, 3000);

document.addEventListener("DOMContentLoaded", initTask);
