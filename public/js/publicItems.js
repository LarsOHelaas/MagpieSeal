    //DOM
    const user = document.getElementById("user");
    const listNameHeader = document.getElementById("listNameHeader");
    const container = document.getElementById("container");


    let logindataJson = localStorage.getItem("logindata");
    if (logindataJson === null) {
        logindataJson = '{"token":"null"}';
    }
    const logindata = JSON.parse(logindataJson);
    const logindataString = JSON.stringify(logindata.token);

    const listDataJson = localStorage.getItem("listData");
    const listData = JSON.parse(listDataJson);
    const listGroupsId = JSON.stringify(listData.listGroupsId);

    function privateList() {
        location.href = "./tasks.html";
    }

    function publicList() {
        location.href = "./public.html";
    }

    function updateUser() {
        location.href = "./updateUser.html";
    }

    //Viser hvem som er logget inn
    const greetings = ["Hello ", "Howdy ", "Hey ", "Greetings ", "Welcome ", "Hiya ", "Ahoy ", "Bonjour ", "Hola ", "Aloha ", "Hai ", "Hei ", "Sup ", "Ay yo ", "Wassap ", "I see you"];
    const randomGreet = Math.floor(Math.random() * greetings.length);
    user.innerText = greetings[randomGreet] + logindata.username;

    function logout() {
        localStorage.clear();
        window.location.reload();
    }

    listNameHeader.innerText = listData.listName;

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
            let response = await fetch("/public/tasks", config);
            let data = await response.json();
            if (response.status === 200) {
                for (let value of data) {
                    const list = document.createElement("h2");
                    const textNode = document.createTextNode(value.itemName);
                    list.appendChild(textNode);
                    
                    container.appendChild(list);

                    function toggleText() {
                        list.classList.toggle("truncate");
                    }
                    toggleText();
                    list.classList.add("publicItemMargin");
                    list.classList.add("hoverItem");

                    list.addEventListener('click', function (evt) {
                        toggleText();
                    });
                }
            } else if (response.status === 404) {
                listNameHeader.innerText = data.msg;
            }
            if (response.status === 403) {
                location.href = "./userLogin.html";
            }

        }
        catch (err) {
            console.log("Something went wrong.")
        }
    }

