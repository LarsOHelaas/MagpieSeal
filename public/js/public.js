    const user = document.getElementById("user");
    const listTitle = document.getElementById("listTitle");
    const container = document.getElementById("container");
    const resTxt = document.getElementById("resTxt");


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

    function privateList() {
        location.href = "./tasks.html";
    }

    function publicList() {
        location.href = "./public.html";
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
            let response = await fetch("/public", config);
            let data = await response.json();

            if (response.status === 200) {
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
                        location.href = "./publicItems.html"
                    });
                }
            } else if (response.status === 404) {
                resTxt.innerText = "No public lists found";
            } else if (response.status === 403) {
                location.href = "./userLogin.html";
            }
        }
        catch (err) {
            console.log("Something went wrong.");
        }
    }

