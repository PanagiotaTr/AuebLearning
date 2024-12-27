const baseUrl = "https://learning-hub-1whk.onrender.com/"

var templates = {}


window.addEventListener('load', function () {

    const urlParams = new URLSearchParams(window.location.search)
    const subcatId = urlParams.get('id')
    const title = urlParams.get('title');

    const subcatName = urlParams.get('subcategory')
    console.log(subcatId)
    console.log(subcatName)

    document.title = `${subcatName}`

    if (title) {
        const templateSource = document.getElementById('subcategory-title').innerHTML;
        const template = Handlebars.compile(templateSource);

        const html = template({ title: title });

        document.querySelector('.main-title').innerHTML = html;
    }

    let headers = new Headers()
    headers.append('Accept', 'application/json')

    let init = {
        method: "GET",
        headers: headers
    }


    let subcatItemsUrl = `${baseUrl}learning-items?subcategory=${subcatId}`
    fetch(subcatItemsUrl, init)
        .then(response => response.json())
        .then(learningItems => {
            for(let item of learningItems){
                let features = item.features.split(';')
                console.log(features)
                let map = {}
                features.forEach(feature => {
                    let [key,value] = feature.split(':')
                    map[key] = value
                });

                item.features = map;
            }

            let subcatItemsScript = document.getElementById("subcategory-items-template")
            templates.subcatItems = Handlebars.compile(subcatItemsScript.textContent)
        
            let subcatItemsContent =  templates.subcatItems({array: learningItems})
            let section = document.querySelector("#info-book")
            section.innerHTML = subcatItemsContent            
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
})