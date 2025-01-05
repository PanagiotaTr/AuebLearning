const baseUrl = "https://learning-hub-1whk.onrender.com/"

var templates = {}

let userLogin = { username: undefined, sessionId: undefined }


window.addEventListener('load', function () {

    const urlParams = new URLSearchParams(window.location.search)
    const categoryId = urlParams.get('id')
    const categoryTitle = urlParams.get('category')

    document.title = categoryTitle
    let h1 = document.querySelector('.main-title > h1')
    h1.innerHTML = categoryTitle

    let learningItemsUrl = `${baseUrl}learning-items?category=${categoryId}`

    let headers = new Headers()
    headers.append('Accept', 'application/json')

    let init = {
        method: "GET",
        headers: headers
    }

    fetch(learningItemsUrl, init)
        .then(response => response.json())
        .then(learningItems => {
            let bookItems = learningItems.filter(item => item.type === "Book")
            let lectureItems = learningItems.filter(item => item.type === "Lecture")
            
            let bookItemsScript = document.getElementById("category-book-template")
            templates.bookItems = Handlebars.compile(bookItemsScript.textContent)
            let bookContent = templates.bookItems({array: bookItems, empty: bookItems.length == 0})

            let divBooks = document.querySelector('#hb-books')
            divBooks.innerHTML = bookContent
            
            let lectureItemsScript = document.getElementById("category-lecture-template")
            templates.lectureItems = Handlebars.compile(lectureItemsScript.textContent)
            let lectureContent = templates.bookItems({array: lectureItems, empty: lectureItems.length == 0})

            let divLectures = document.querySelector('#hb-lectures')
            divLectures.innerHTML = lectureContent
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    ///////////////////////////////////////        LOGIN PART        ///////////////////////////////////////

    // button οταν κανει κλικ το ανθρωπακι-user
    let choseLoginButton = document.getElementById('login-form-btn')
    // button για το παραθυρο του login
    let loginWindow = document.getElementById('login')

    // εμφανιση του login παραθυρου
    choseLoginButton.addEventListener('click', function(){
        loginWindow.style.display = 'block'
    })

    // κλεισιμο του login παραθυρου (x)
    let closeButton = document.getElementById('close-form-btn')
    closeButton.addEventListener('click', function(){
        loginWindow.style.display = 'none'
    })

    // button για το login 
    let checkLoginButton = document.getElementById('login-submit-btn')
    checkLoginButton.addEventListener('click', function (event) {
        
        event.preventDefault();
        let formElements = document.getElementById('login');
    
        let headers = new Headers();
        headers.append("Content-Type", "application/x-www-form-urlencoded");

        let formData = new FormData(formElements);
        let urlForm = new URLSearchParams(formData).toString();

        let init = {
            method: "POST",
            headers: headers,
            body: urlForm
        };

        fetch('/login', init)
            .then(response => {
                if (response.status === 200) {
                    // console.log("Login successful.");
                    let loginWindow = document.getElementById('login');
                    let successfulMsg = document.getElementById('success-login-msg');

                    loginWindow.style.display = 'none';

                    successfulMsg.style.display = 'block';
                    setTimeout(() => {
                        successfulMsg.style.display = 'none';
                    }, 3000);

                    return response.json();
                } else if (response.status === 401) {
                    // console.error("Authentication failed.");
                    let loginWindow = document.getElementById('login')
                    let failMsg = document.getElementById('fail-login-msg');

                    loginWindow.style.display = 'none';

                    failMsg.style.display = 'block';

                    setTimeout(() => {
                        failMsg.style.display = 'none';
                        loginWindow.style.display = 'block';
                    }, 3000);

                    throw new Error("Fail login");
                } else if (response.status === 501) {
                    // console.error("Server error during login.");
                    throw new Error("Server error");
                } else {
                    // console.error("Unexpected response:", response.status);
                    throw new Error("Unexpected error");
                }
            })
            .then(object => {
                console.log("User logged in:", object);
                userLogin.username = object.username;
                userLogin.sessionId = object.sessionId;
            })
            .catch(err => {
                console.error("Error during login process:", err);
            });
    });
})