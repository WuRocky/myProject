let section = document.querySelector("section");
let add = document.querySelector("form button");
add.addEventListener("click", (e) => {
    // prevent form from being submitted
    e.preventDefault();

    // get the input values
    let form = e.target.parentElement;
    let todoText = form.children[0].value;
    let todoMonth = form.children[1].value;
    let todoDate = form.children[2].value;

    //設定如果點擊時表單是空白會回傳文字訊息
    if (todoText === "") {
        alert("Please Enter some Text.");
        //一定要加入這個return，我們都在執行click的事件，不希望下面的程式碼執行，所以用
        return;
    }

    // create a todo
    let todo = document.createElement("div");
    todo.classList.add("todo");
    let text = document.createElement("p");
    text.classList.add("todo-text");
    text.innerText = todoText;
    let time = document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoMonth + " / " + todoDate;
    todo.appendChild(text);
    todo.appendChild(time);

    // create green check and red trash can
    let completeButton = document.createElement("button");
    completeButton.classList.add("complete");
    completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;

    completeButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;
        todoItem.classList.toggle("done");
    });

    let trashButton = document.createElement("button");
    trashButton.classList.add("trash");
    trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

    //垃圾桶按鈕設定
    trashButton.addEventListener("click", (e) => {
        let todoItem = e.target.parentElement;

        todoItem.addEventListener("animationend", () => {
            // remove from local storage
            let text = todoItem.children[0].innerText;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            myListArray.forEach((item, index) => {
                if (item.todoText == text) {
                    myListArray.splice(index, 1);
                    localStorage.setItem(
                        "list",
                        JSON.stringify(myListArray)
                    );
                }
            });

            todoItem.remove();
        });

        todoItem.style.animation = "scaleDown 0.3s forwards";
    });

    todo.appendChild(completeButton);
    todo.appendChild(trashButton);

    todo.style.animation = "scaleUp 0.3s forwards";

    //create an object，所獲得的資料儲存進localStorage裡面，儲存的方式是建立一個object
    //把todoText, todoMonth, todoDate做成object放進myTodo(array)裡面
    let myTodo = {
        todoText: todoText,
        todoMonth: todoMonth,
        todoDate: todoDate,
    };

    // store data into an array of object，將資料放入array裡面，而array裡面都是object
    let myList = localStorage.getItem("list");
    if (myList == null) {
        //用JSON.stringify把myTodo變成string
        localStorage.setItem("list", JSON.stringify([myTodo]));
    } else {
        //要用JSON.parse，myList才會變成array
        let myListArray = JSON.parse(myList);
        myListArray.push(myTodo);
        //用JSON.stringify把myListArray變成string
        localStorage.setItem("list", JSON.stringify(myListArray));
    }

    console.log(JSON.parse(localStorage.getItem("list")));

    // clear the text input
    form.children[0].value = "";
    section.appendChild(todo);
});

loadData();

function loadData() {
    let myList = localStorage.getItem("list");
    if (myList !== null) {
        let myListArray = JSON.parse(myList);
        myListArray.forEach((item) => {
            // create a todo
            let todo = document.createElement("div");
            todo.classList.add("todo");
            let text = document.createElement("p");
            text.classList.add("todo-text");
            text.innerText = item.todoText;
            let time = document.createElement("p");
            time.classList.add("todo-time");
            time.innerText = item.todoMonth + " / " + item.todoDate;
            todo.appendChild(text);
            todo.appendChild(time);

            // create green check and red trash can
            let completeButton = document.createElement("button");
            completeButton.classList.add("complete");
            completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
            completeButton.addEventListener("click", (e) => {
                let todoItem = e.target.parentElement;
                todoItem.classList.toggle("done");
            });

            let trashButton = document.createElement("button");
            trashButton.classList.add("trash");
            trashButton.innerHTML = '<i class="fa-solid fa-trash"></i>';

            //垃圾桶按鈕設定
            trashButton.addEventListener("click", (e) => {
                let todoItem = e.target.parentElement;

                todoItem.addEventListener("animationend", () => {
                    // remove from local storage
                    let text = todoItem.children[0].innerText;
                    let myListArray = JSON.parse(
                        localStorage.getItem("list")
                    );
                    myListArray.forEach((item, index) => {
                        if (item.todoText == text) {
                            myListArray.splice(index, 1);
                            localStorage.setItem(
                                "list",
                                JSON.stringify(myListArray)
                            );
                        }
                    });

                    //這邊只有把HTML移除，但localStorage沒有移除
                    todoItem.remove();
                });

                todoItem.style.animation = "scaleDown 0.3s forwards";
            });

            todo.appendChild(completeButton);
            todo.appendChild(trashButton);

            section.appendChild(todo);
        });
    }
}

function mergeTime(arr1, arr2) {
    let result = [];
    let i = 0;
    let j = 0;

    while (i < arr1.length && j < arr2.length) {
        if (Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)) {
            result.push(arr2[j]);
            j++;
        } else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)) {
            result.push(arr1[i]);
            i++;
        } else if (
            Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)
        ) {
            if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)) {
                result.push(arr2[j]);
                j++;
            } else {
                result.push(arr1[i]);
                i++;
            }
        }
    }

    while (i < arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j < arr2.length) {
        result.push(arr2[j]);
        j++;
    }

    return result;
}

function mergeSort(arr) {
    if (arr.length === 1) {
        return arr;
    } else {
        let middle = Math.floor(arr.length / 2);
        let right = arr.slice(0, middle);
        let left = arr.slice(middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    // sort data
    let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list", JSON.stringify(sortedArray));

    // remove data
    let len = section.children.length;
    for (let i = 0; i < len; i++) {
        section.children[0].remove();
    }

    // load data
    loadData();
});
