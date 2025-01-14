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
            let err = new Error("Ο χρήστης δεν βρέθηκε")
            err.code = 401
            throw err
        }
        else if (response.status === 501) {
            let err = new Error("Server error")
            err.code = 501
            throw err
        }
        else{
            let err = new Error("Unexpected error")
            err.code = 500
            throw err
        }
    })
    .then(itemsJson => {
        cartList = itemsJson.cartItems;
        cartTotalCost = itemsJson.totalCost
    })
    .catch(error => {
        console.error('Σφάλμα κατά τη φόρτωση του καλαθιού:', error);
        // alert('Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα.');
        alert(`${error.code} - ${error} - Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα. `)
        cartList = []
        cartTotalCost = 0
        window.location.href = "index.html";
    });

function removeItemFromCart(id,updateTotalCost){

    let headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let body = JSON.stringify({'username': username, 'sessionId': sessionId, 'id': id})
    let init = {
        method: "DELETE",
        headers: headers,
        body: body
    }
    fetch('/cart',init)
        .then(response => {
            if (response.status === 200){
                return response.json()
            }
            else if (response.status === 404){
                let err = new Error('Δεν βρέθηκε το προϊόν στο καλάθι σας')
                err.code = 404
                throw err
            }
            else{
                
            }
        })
        .then(response => {
            let newTotalCost = response.newTotalCost
            updateTotalCost(newTotalCost)
        })
        .catch(err => {throw err})
}