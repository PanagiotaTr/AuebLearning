const baseUrl = "https://learning-hub-1whk.onrender.com/"

var templates = {}


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
})