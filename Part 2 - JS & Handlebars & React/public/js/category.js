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
            let bookContent = templates.bookItems({ array: bookItems, empty: bookItems.length == 0 })

            let divBooks = document.querySelector('#hb-books')
            divBooks.innerHTML = bookContent

            let lectureItemsScript = document.getElementById("category-lecture-template")
            templates.lectureItems = Handlebars.compile(lectureItemsScript.textContent)
            let lectureContent = templates.lectureItems({ array: lectureItems, empty: lectureItems.length == 0 })

            let divLectures = document.querySelector('#hb-lectures')
            divLectures.innerHTML = lectureContent

            // Παίρνουμε το κουμπί από κάθε προιον που έχει δημιουργηθεί από το Handlebars και προσθέτουμε τον listener
            let addToCartBtns = document.querySelectorAll('.add-to-cart')
            addToCartBtns.forEach(button => button.addEventListener('click', addToCart))
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });

    ///////////////////////////////////////        LOGIN PART        ///////////////////////////////////////

    // button οταν κανει κλικ το ανθρωπακι-user
    let choseLoginButton = document.getElementById('login-form-btn')
    // button για το παραθυρο του login
    let loginWindow = document.getElementById('login')

    // button για το παραθυρο του sign-out
    let signOutButton = document.getElementById('sign-out-btn')
    
    // αποσύνδεση λογαριασμου
    signOutButton.addEventListener('click', function(){
        choseLoginButton.style.display = 'block'
    })

    // εμφανιση του login παραθυρου
    choseLoginButton.addEventListener('click', function () {
        loginWindow.style.display = 'block'
    })

    // κλεισιμο του login παραθυρου (x)
    let closeButton = document.getElementById('close-form-btn')
    closeButton.addEventListener('click', function () {
        loginWindow.style.display = 'none'
    })

    // ελεγχος για τα πεδια του login
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const usernameError = document.getElementById('username-error');
    const passwordError = document.getElementById('password-error');

    password.addEventListener('focus', function () {
        if (!isUsernameValid()) {
            usernameError.textContent = "Το όνομα χρήστη δεν είναι σωστό.";
            usernameError.style.display = 'block';
        }
    });

    // button για το login 
    let checkLoginButton = document.getElementById('login-submit-btn')
    checkLoginButton.addEventListener('click', function (event) {

        event.preventDefault();

        usernameError.style.display = 'none';
        passwordError.style.display = 'none';

        const validUsername = isUsernameValid();
        const validPassword = isPasswordValid();

        if (!validUsername || !validPassword) {
            return;
        }

        let formElements = document.getElementById('login');

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        let formData = new FormData(formElements);
        let bodyLogin = JSON.stringify({username: formData.get('username'), password: formData.get('password')})

        let init = {
            method: "POST",
            headers: headers,
            body: bodyLogin
        };

        fetch('/login', init)
            .then(response => {
                if (response.status === 200) {
                    // console.log("Login successful.");
                    let loginWindow = document.getElementById('login');
                    let successfulMsg = document.getElementById('success-login-msg');
                    

                    loginWindow.style.display = 'none';
                    choseLoginButton.style.display = 'none'

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
                userLogin.username = formData.get('username');
                userLogin.sessionId = object.sessionId;
            })
            .catch(err => {
                console.error("Error during login process:", err);
            });
    });

    loginWindow.addEventListener('click', function () {
        if (username.checkValidity()) {
            usernameError.textContent = "";
            usernameError.style.display = 'none';
        }
        if (password.checkValidity()) {
            passwordError.textContent = "";
            passwordError.style.display = 'none';
        }
    });


    // --------------------------------- ADD TO CART ---------------------------------------- 


})

function addToCart(event) {
    let addToCartBtn = event.target
    if (event.target.tagName === 'I') {
        addToCartBtn = event.target.closest('button')
    }

    if (userLogin.username === undefined || userLogin.sessionId === undefined) {
        let target = document.getElementById('fail-login-msg');
        displayErrorMessage(target,'Παρακαλώ συνδεθείτε για να προσθέσετε το προϊόν στο καλάθι!')

    }
    else {
        let headers = new Headers()
        headers.append('Content-Type', 'application/json');

        let title = addToCartBtn.dataset.title
        let id = addToCartBtn.dataset.id
        let type = addToCartBtn.dataset.type
        let cost = addToCartBtn.dataset.cost
        let image = addToCartBtn.dataset.image

        let body = JSON.stringify({ username: userLogin.username, sessionId: userLogin.sessionId, title: title, id: id, type: type, cost: cost, image: image})

        let init = {
            method : "POST",
            headers : headers,
            body : body
        }

        fetch('/cart/add',init)
            .then(response => {
                switch(response.status){
                    case 200:
                        console.log("Success")
                        displaySuccessMessage(document.getElementById('success-login-msg'), "Το προϊόν προστέθηκε με επιτυχία!")
                        break;
                    case 409:
                        console.log("Item already in cart")
                        displayErrorMessage(document.getElementById('fail-login-msg'), "Το προϊόν υπάρχει ήδη στο καλάθι σας!")
                        throw new Error("Item already in cart")
                    default:
                        console.log("Unexpected Error")
                        throw new Error("Unexpected Error")
                }
            })
            .catch(err => {
                console.log(err)
            })

    }
}

function displayErrorMessage(target,message){
    target.style.display = 'block';
    target.innerHTML = `<i class="fas fa-times-circle"></i> ${message}`

    setTimeout(() => {
        target.style.display = 'none';
        target.innerHTML = '<i class="fas fa-times-circle"></i> Αποτυχία σύνδεσης! Συμπληρώστε τα στοιχεία σας'
    }, 3000);
}

function displaySuccessMessage(target,message){
    
    target.style.display = 'block';
    target.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`

    setTimeout(() => {
        target.style.display = 'none';
        target.innerHTML = '<i class="fas fa-check-circle"></i> Επιτυχής σύνδεση!</span>'
    }, 3000);
}

// ελεγχος username
function isUsernameValid() {
    if (!username.checkValidity()) {
        usernameError.textContent = "Το όνομα χρήστη δεν έχει σωστή μορφή.";
        usernameError.style.display = 'block';
        return false;
    }
    return true;
}

// ελεγχος password
function isPasswordValid() {
    if (!password.checkValidity()) {
        passwordError.textContent = "Ο κωδικός πρόσβασης δεν έχει σωστή μορφή.";
        passwordError.style.display = 'block';
        return false;
    }
    return true;
}