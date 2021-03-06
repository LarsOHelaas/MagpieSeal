    const user = document.getElementById("user");
    const listTitle = document.getElementById("listTitle");
    const container = document.getElementById("container");


    let logindataJson = localStorage.getItem("logindata");
    if (logindataJson === null) {
        logindataJson = '{"token":"null"}';
    }
    let logindata = JSON.parse(logindataJson);
    let logindataString = JSON.stringify(logindata.token);

    //Viser hvem som er logget inn
    let greetings = ["Hello ", "Howdy ", "Hey ", "Greetings ", "Welcome ", "Hiya ", "Ahoy ", "Bonjour ", "Hola ", "Aloha ", "Hai ", "Hei ", "Sup ", "Ay yo ", "Wassap ", "I see you"];
    let randomGreet = Math.floor(Math.random() * greetings.length);
    user.innerHTML = greetings[randomGreet] + logindata.username;

    function logout() {
        localStorage.clear();
        window.location.reload();
    }

    function updateUser() {
        location.href = "./updateUser.html";
    }

    function publicList() {
        location.href = "./public.html";
    } 

    function privateList() {
        location.href = "./tasks.html";
    }

    window.addEventListener("pageshow", function (event) {
        let historyCheck = (window.performance.navigation.type === 2);
        if (historyCheck) {
            window.location.reload();
        }
    });

    loadData();
    async function loadData() {

        let config = {
            method: "GET",
            headers: {
                "authorization": logindataString
            }
        }

        try {
            let response = await fetch("/tasks", config);
            let data = await response.json();
            if (response.status === 403) {
                location.href = "./userLogin.html";
            }
            for (let value of data) {
                let listDiv = document.createElement("div");
                let html = `
                        <h2>${value.listName}</h2>                       
                    `;

                listDiv.classList.add("hoverItem");
                listDiv.innerHTML = html;
                container.appendChild(listDiv);

                listDiv.addEventListener('click', function (evt) {
                    localStorage.setItem("listData", JSON.stringify(value));
                    location.href = "./listItems.html"
                });
            }
        }
        catch (err) {
            
        }
    }

    document.getElementById("createList").onclick = async function (evt) {

        if (listTitle.value.length <= 0) {
            alert("Must type in title");
            return;
        }
        let body = {
            title: listTitle.value
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
            let response = await fetch("/tasks", config);
            let data = await response.json();

        }
        catch (err) {
            console.log("Something went wrong.")
        }
        window.location.reload();
    }
