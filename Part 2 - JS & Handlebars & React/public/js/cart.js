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
    })
    .then(itemsJson => {
        cartList = itemsJson.cartItems;
        cartTotalCost = itemsJson.totalCost
        // const productList = document.querySelector('.product-list');
        // let productHTML = '';

        // let icon = "";


        // listCart.forEach((item, index) => {
        //     if (item.type === "Book") {
        //         icon = "<i class='fa fa-book'></i>";
        //     } else if (item.type === "Lecture") {
        //         icon = "<i class='fa fa-chalkboard-teacher'></i>";
        //     }
        //     const row = `
        //     <tr id='make-table-card'>
        //         <td>${index + 1}</td>
        //         <td class="product-title">${icon} ${item.title}</td>
        //         <td>
        //             <button>-</button>
        //             <span>1</span>
        //             <button>+</button>
        //         </td>
        //         <td class="product-price">€${item.cost}</td>
        //         <td class="delete-td" style="padding-left: 10px;">
        //             <button class="delete-btn">
        //                 <i class="fa fa-trash"></i>
        //             </button>
        //         </td>
        //     </tr>
        // `;

        //     productHTML += row;
        // });
        // productList.innerHTML = productHTML;

        // const totalPriceElement = document.querySelector('#total-price');
        // const formattedCost = cartItems.totalCost.toLocaleString('de-DE');
        // totalPriceElement.textContent = `€${formattedCost}`;


    })
    .catch(error => {
        console.error('Σφάλμα κατά τη φόρτωση του καλαθιού:', error);
        alert('Δεν ήταν δυνατή η φόρτωση του καλαθιού σας. Προσπαθήστε ξανά αργότερα.');
    });