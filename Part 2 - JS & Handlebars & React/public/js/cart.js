var cartList
var cartTotalCost

const urlParams = new URLSearchParams(window.location.search);
const username = urlParams.get('username');
const sessionId = urlParams.get('sessionId');

/**
 * A async function that fetches the cart of a user in order to be displayed
 * 
 * This function sends a GET request to receive the content of the users cart. If successful, the cart is successfully
 * displayed. If an error occurs, an alert is displayed containing the error code and the corresponding message
 * 
 * @returns {Promise<{cartList: Array<LearningItem>, cartTotalCost: number}>}
 */
function fetchCartData() {
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

    return fetch(url, init)
        .then(response => {

            if (response.status === 200) {
                return response.json()
            }
            else if (response.status === 401) {
                let err = new Error("Ο χρήστης δεν βρέθηκε")
                err.code = 401
                throw err
            }
            else if (response.status === 501) {
                let err = new Error("Server error")
                err.code = 501
                throw err
            }
            else {
                let err = new Error("Unexpected error")
                err.code = 500
                throw err
            }
        })
        .then(itemsJson => {
            cartList = itemsJson.cartItems;
            cartTotalCost = itemsJson.totalCost
            return { cartList, cartTotalCost }
        })
        .catch(error => {
            console.error('Σφάλμα κατά τη φόρτωση του καλαθιού:', error);
            // alert('Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα.');
            alert(`${error.code} - ${error} - Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα. `)
            cartList = []
            cartTotalCost = 0
            window.location.href = "index.html";
            return { cartList, cartTotalCost }
        });


}

/**
 * Removes an item from the cart of a user
 * 
 * This function sends a DELETE request to remove a learningItem from the cart of a user. If successful, it updates
 * the total cost of the cart and changes the state of the item to removed so it doesnt display
 * 
 * @param {number} id - The id of the learning item that is going to be removed from the cart
 * @param {(newCost: number) => void} updateTotalCost - Function that sets the new total cost of the cart
 * @param {(removed: boolean) => void} setRemoved  - Function that sets the removed state of a learningItem
 */
function removeItemFromCart(id, updateTotalCost, setRemoved) {

    let headers = new Headers()
    headers.append('Content-Type', 'application/json')

    let body = JSON.stringify({ 'username': username, 'sessionId': sessionId, 'id': id })
    let init = {
        method: "DELETE",
        headers: headers,
        body: body
    }
    fetch('/cart', init)
        .then(response => {
            if (response.status === 200) {
                return response.json()
            }
            else if (response.status === 404) {
                let err = new Error('Δεν βρέθηκε το προϊόν στο καλάθι σας')
                err.code = 404
                throw err
            }
            else if (response.status === 401) {
                let err = new Error('Ο χρήστης δεν βρέθηκε')
                err.code = 401
                throw err
            }
            else {
                let err = new Error('Μη αναμενόμενο σφάλμα κατά την ενημέρωση του καλαθιού')
                err.code = 500
                throw err
            }
        })
        .then(response => {
            let newTotalCost = response.newTotalCost
            setRemoved(true)
            updateTotalCost(newTotalCost)
        })
        .catch(err => { alert(`${err.code} - ${err.message}`) })
}