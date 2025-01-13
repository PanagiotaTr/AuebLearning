var cartList
var cartTotalCost

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const sessionId = urlParams.get('sessionId');


if (!username || !sessionId) {
    console.log("Παρακαλώ, συνδεθείτε για να δείτε το καλάθι σας.");
    window.location.href = "index.html";
}

const url = `/cart?username=${encodeURIComponent(username)}&sessionId=${encodeURIComponent(sessionId)}`;

let headers = new Headers();
headers.append('Content-Type', 'application/json');

let init = {
    method: "GET",
    headers: headers
};

fetch(url, init)
    .then(response => {

        if (response.status === 200) {
            return response.json()
        }
        else if (response.status === 401){
            throw new Error("Fail");
        }
        else if (response.status === 501) {
            throw new Error("Server error");
        }
        else{
            throw new Error("Unexpected error");
        }
    })
    .then(itemsJson => {
        cartList = itemsJson.cartItems;
        cartTotalCost = itemsJson.totalCost
    })
    .catch(error => {
        console.error('Σφάλμα κατά τη φόρτωση του καλαθιού:', error);
        alert('Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα.');
    });