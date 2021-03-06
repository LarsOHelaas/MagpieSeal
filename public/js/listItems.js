    //DOM
    const user = document.getElementById("user");
    const listName = document.getElementById("listName");
    const listNameHeader = document.getElementById("listNameHeader");
    const inputItem = document.getElementById("inputItem");
    const activeItem = document.getElementById("activeItem");
    const inputItemUpdate = document.getElementById("inputItemUpdate");
    const publicStatus = document.getElementById("publicStatus");
    const itemsCont = document.getElementById("itemsCont");
    const btnCont = document.getElementById("btnCont");
    const inpCont = document.getElementById("inpCont");
    const subCont = document.getElementById("subCont");


    let logindataJson = localStorage.getItem("logindata");
    if (logindataJson === null) {
        logindataJson = '{"token":"null"}';
    }
    const logindata = JSON.parse(logindataJson);
    const logindataString = JSON.stringify(logindata.token);

    let listDataJson = localStorage.getItem("listData");
    if (listDataJson === null) {
        listDataJson = '{"listGroupsId":"null"}';
    }
    const listData = JSON.parse(listDataJson);
    const listGroupsId = JSON.stringify(listData.listGroupsId);

    //Viser hvem som er logget inn
    const greetings = ["Hello ", "Howdy ", "Hey ", "Greetings ", "Welcome ", "Hiya ", "Ahoy ", "Bonjour ", "Hola ", "Aloha ", "Hai ", "Hei ", "Sup ", "Ay yo ", "Wassap ", "I see you" ];
    const randomGreet = Math.floor(Math.random() * greetings.length);
    user.innerText = greetings[randomGreet] + logindata.username;


    function logout() {
        localStorage.clear();
        window.location.reload();
    }


    function privateList() {
        location.href = "./tasks.html";
    }

    function updateUser() {
        location.href = "./updateUser.html";
    }


    function publicList() {
        location.href = "./public.html";
    }




    let listItemsId = null;


    //henter inn list items 
    loadData();
    async function loadData() {


        let body = {
            listGroupsId: listGroupsId
        }
        let config = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/items", config);
            let data = await response.json();
            if (response.status === 200) {
                if (data.list[0].public === 0) {
                    publicStatus.innerText = "List is private"
                } else {
                    publicStatus.innerText = "List is public"
                }
                listNameHeader.innerText = data.list[0].listName;
                for (let value of data.items) {
                    
                    const list = document.createElement("h2");
                    const textNode = document.createTextNode(value.itemName);
                    list.appendChild(textNode);

                    const button = document.createElement("button");
                    const buttonNode = document.createTextNode("X");
                    button.appendChild(buttonNode);
                     
                    const newInp = document.createElement("input");
                    newInp.setAttribute("type", "text");
                    const newBr = document.createElement("br");

                    const submit = document.createElement("button");
                    const submitNode = document.createTextNode("Update");
                    submit.appendChild(submitNode);

                    function toggleText() {
                        list.classList.toggle("truncate");
                    }
                    toggleText();

                    list.classList.add("hoverItem");
                    button.classList.add("block");
                    newInp.classList.add("block");
                    submit.classList.add("block");
                    list.classList.add("privateItemMargin")
                    
                  
                    itemsCont.appendChild(list);
                    btnCont.appendChild(button);
                    inpCont.appendChild(newInp);
                    subCont.appendChild(submit);

                    button.addEventListener('click', async function (evt) {
                        let body = {
                            listItemsId: value.listItemsId
                        }
                        let config = {
                            method: "DELETE",
                            headers: {
                                "content-type": "application/json",
                                "authorization": logindataString
                            },
                            body: JSON.stringify(body)
                        }

                        try {
                            let response = await fetch("/tasks/deleteListItems", config);
                            let data = await response.json();

                            console.log(data);
                        }
                        catch (err) {
                            console.log("Something went wrong.")
                        }
                        window.location.reload();
                    });

                    submit.addEventListener('click', async function (evt) {
                        if (newInp.value <= 0) {
                            alert("Must type inn item name")
                            return;
                        }
                        let body = {
                            itemName: newInp.value,
                            listItemsId: value.listItemsId
                        }
                        let config = {
                            method: "PUT",
                            headers: {
                                "content-type": "application/json",
                                "authorization": logindataString
                            },
                            body: JSON.stringify(body)
                        }

                        try {
                            let response = await fetch("/tasks/updateListItems", config);
                            let data = await response.json();

                            console.log(data);
                        }
                        catch (err) {
                            console.log("Something went wrong.")
                        }
                        window.location.reload();
                    });
                    list.addEventListener('click', function (evt) {
                        toggleText();
                        listItemsId = value.listItemsId;
                        activeItem.innerText = "Selected item: " + value.itemName;
                    });
                }
            }
            if (response.status === 403) {
                location.href = "./userLogin.html";
            }

        }
        catch (err) {
            console.log("Something went wrong.")
            location.href="./tasks.html";
        }

    }

 
    document.getElementById("updateList").onclick = async function (evt) {
        if (listName.value.length <= 0) {
            alert("Must type in title");
            return;
        }
        let body = {
            listName: listName.value,
            listGroupsId: listGroupsId
        }
        let config = {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/updateLists", config);
            let data = await response.json();

            console.log(data);
        }
        catch (err) {
            console.log("Something went wrong.")
        }
        window.location.reload();
    }

 
    document.getElementById("deleteList").onclick = async function (evt) {

        let body = {
            listGroupsId: listGroupsId
        }
        let config = {
            method: "DELETE",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/deleteLists", config);
            let data = await response.json();

            console.log(data);
        }
        catch (err) {
            console.log("Something went wrong.")
        }
        location.href = "./tasks.html"
    }

   
    document.getElementById("newItem").onclick = async function (evt) {
        if (inputItem.value <= 0) {
            alert("Must type inn item")
            return;
        }
        let body = {
            itemName: inputItem.value,
            listGroupsId: listGroupsId
        }
        let config = {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/addListItem", config);
            let data = await response.json();

            console.log(data);
        }
        catch (err) {
            console.log("Something went wrong.")
        }
        window.location.reload();
    }


    document.getElementById("updateItem").onclick = async function (evt) {
        if (inputItemUpdate.value <= 0 || listItemsId === null) {
            alert("Must type inn item name and select an item to update")
            return;
        }
        let body = {
            itemName: inputItemUpdate.value,
            listItemsId: listItemsId
        }
        let config = {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/updateListItems", config);
            let data = await response.json();

            console.log(data);
        }
        catch (err) {
            console.log("Something went wrong.")
        }
        window.location.reload();
    }


    document.getElementById("togglePublic").onclick = async function (evt) {
        let body = {
            listGroupsId: listGroupsId
        }
        let config = {
            method: "PUT",
            headers: {
                "content-type": "application/json",
                "authorization": logindataString
            },
            body: JSON.stringify(body)
        }

        try {
            let response = await fetch("/tasks/togglePublic", config);
            let data = await response.json();
            publicStatus.innerText = data.msg;
            //console.log(data);
        }
        catch (err) {
            console.log("Something went wrong.")
        }
        window.location.reload();
    }
