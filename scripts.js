console.debug("Starting script...");

window.onload = function () {
    this.setTimeout(() => renderPage(true), 300);
    this.setTimeout(() => renderPage(false), 1100);
    initSubmits();
    initTextBox();
}

let initSubmits = () => {
    let inputSubmits = this.document.querySelectorAll("input[type=submit]");
    inputSubmits.forEach(
        item => {
            item.addEventListener("mousedown", setStyleDown);
            item.addEventListener("mouseup", setStyleUpOrOut);
            item.addEventListener("mouseout", setStyleUpOrOut);
            if (item.id == "ButtonNewList") item.addEventListener("click", insertNewList);
            else if (item.id == "ButtonDeleteList") item.addEventListener("click", deleteList);
            else if (item.id == "todoButtonAdd") item.addEventListener("click", insertNewListItem);
            else if (item.id == "todoButtonReset") item.addEventListener("click", resetList);
            else item.addEventListener("click", handlePaging)
        }
    );
}
let initTextBox = () => {
    let textBox = this.document.getElementById("todoText");
    textBox.addEventListener("focus", (e) => e.target.className = "active");
    textBox.addEventListener("focusout", (e) => e.target.className = "inactive");
    textBox.addEventListener('keypress', insertNewListItem);
}

let setStyleDown = (e) => {
    e.target.style.textShadow = "0 0 2px #004B8D, 0 0 3px #004B8D, 0 0 4px #004B8D";
    e.target.style.backgroundColor = "#FFF";
}
let setStyleUpOrOut = (e) => {
    e.target.style.textShadow = "2px 2px 1px #444, 2px 2px 2px #444";
    e.target.style.backgroundColor = "rgba(0,0,0,0)";
}

let insertNewList = () => {
    let todoLists;
    let indexerElement = document.getElementById("indexer");
    let listsContainer = document.getElementById("listsContainer");
    let listType = document.getElementById("list_type");
    let newList = document.createElement(listType.value);
    newList.className = "todoList";
    let selected = listType.selectedIndex;
    let options = document.querySelectorAll("select option");
    if (options[selected].text == "simple list") newList.classList.add("noStyle");

    listsContainer.appendChild(newList);
    todoLists = document.getElementsByClassName("todoList");

    for (var i = 0; i < todoLists.length-1; i++) {
        todoLists[i].style.display = "none";
    }
    indexerElement.innerHTML = todoLists.length;
    document.getElementById("todoText").focus();
}
let deleteList = () => {
    document.getElementById("todoText").focus();
    let indexerElement = document.getElementById("indexer");
    let index = parseInt(indexerElement.innerHTML) - 1;
    let todoLists = document.getElementsByClassName("todoList");

    if (todoLists.length < 2) return;
    else if (!confirm("This list will be deleted permanently!\nDo you want to continue?")) return;
    else todoLists[index].remove();

    if (index) {
        goToPage(index-1, indexerElement, todoLists, false);
    }
    else {
        goToPage(0, indexerElement, todoLists, false);
    }
}

let insertNewListItem = (e) => {
    let keyCode = e.which || e.keyCode;
    if (keyCode != 13 && e.button != 0) {
        return;
    }

    let listIndex = document.getElementById("indexer").innerHTML;
    let todoLists = document.getElementsByClassName("todoList");
    let input = document.getElementById("todoText");

    if (input.value.length > 0) {
        let li = document.createElement("li");
        li.style.display = "none";
        let textNode = document.createTextNode(input.value);
        li.appendChild(textNode);

        let ins = document.createElement("ins");

        let bin = document.createElement("span");
        bin.className = "material-icons";
        bin.textContent = "delete";
        bin.addEventListener("click", liClickHandler);

        let tick = document.createElement("span");
        tick.className = "material-icons";
        tick.textContent = "check_circle_outline";
        tick.addEventListener("click", liClickHandler);

        ins.appendChild(bin);
        ins.appendChild(tick);
        li.appendChild(ins);

        todoLists[listIndex - 1].appendChild(li);
        $("li:last-child").fadeIn("slow");
        input.value = "";
    }
    else {
        showErrorMsg("There is nothing to add...");
    }
    input.focus();
}
let resetList = () => {
    let answer = confirm("All these list-items will be deleted permanently!\nDo you want to continue?");
    let i = parseInt(document.getElementById("indexer").innerHTML) - 1;
    if (answer) {
        document.getElementsByClassName("todoList")[i].innerHTML = '';
    }
    document.getElementById("todoText").focus();
}

let handlePaging = (e) => {
    let sender = e.target;
    let id = sender.id;

    let indexerElement = document.getElementById("indexer");
    let todoLists = document.getElementsByClassName("todoList");

    switch (id) {
        case "todoListFirst":
            goToPage(0, indexerElement, todoLists);
            break;
        case "todoListPrev":
            goToPage(indexer.innerHTML-2, indexerElement, todoLists);;
            break;
        case "todoListNext":
            goToPage(indexer.innerHTML, indexerElement, todoLists);;
            break;
        case "todoListLast":
            goToPage(todoLists.length-1, indexerElement, todoLists);;
            break;
        default:
            console.error("Paging failed on line 106!");
            throw new DOMException("Paging failed on line 106!", "NotImplementedException");
            break;
    }
}
let goToPage = (where, indexer, todos, option = true) => {
    where = parseInt(where);
    let len = todos.length;
    if ((todos.length < 2 || where < 0 || where >= len) && option) return;
    indexer.innerHTML = where+1;
    for (var i = 0; i < len; i++) {
        if (i == where) todos[i].style.display = "block";
        else todos[i].style.display = "none";
    }
}

let showErrorMsg = (str) => {
    let error = document.querySelector(".error");
    error.innerHTML = str;
    error.style.visibility = 'visible';
    setTimeout(function () { error.style.visibility = 'hidden'; }, 4000);
}
let liClickHandler = (e) => {
    let span = e.target;
    let li = span.parentNode.parentNode;

    if (span.innerHTML == "delete") {
        li.remove();
    }
    else if (span.innerHTML == "check_circle_outline") {
        li.style.color = "rgba(255,255,255,0.2)";
        span.innerHTML = "check_circle";
    }
    else {
        li.style.color = "rgba(255,255,255,1)";
        span.innerHTML = "check_circle_outline";
    }
}

let renderPage = (phase) => {
    if (phase) {
        $(":not(input).animable").fadeIn(800);
    }
    else {
        $("input.animable").slideDown(600);
    }
}