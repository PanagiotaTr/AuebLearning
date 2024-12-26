const baseUrl = "https://learning-hub-1whk.onrender.com";

document.addEventListener('DOMContentLoaded', () => {
    const categoriesListContainer = document.querySelector("#categories-list");

    const categoryTemplate = document.getElementById('categories-template').innerHTML;
    const template = Handlebars.compile(categoryTemplate);

    let headers = new Headers()
    headers.append('Accept', 'application/json')

    let init = {
        method: "GET",
        headers: headers
    }

    fetch(`${baseUrl}/categories`,init)
        .then(response => response.json())
        .then(categories => {
            categories = categories.map(category => ({
                ...category,
                img_url: `${baseUrl}/${category.img_url}`
            }));
            
            const html = template({ categories });
            categoriesListContainer.innerHTML = html;

            categories.forEach(category => {
                fetchSubcategories(category.id);
            });
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη λήψη δεδομένων:", error);
            categoriesListContainer.innerHTML = "<p>Αποτυχία φόρτωσης κατηγοριών.</p>";
        });


    function fetchSubcategories(categoryId) {
        fetch(`${baseUrl}/categories/${categoryId}/subcategories`,init)
            .then(response => response.json())
            .then(subcategories => {
                const subcategoriesList = document.getElementById(`subcategories-${categoryId}`);

                subcategories.forEach(subcategory => {
                    const li = document.createElement('li');
                    li.textContent = subcategory.title;
                    subcategoriesList.appendChild(li);
                });
            })
            .catch(error => {
                console.error(`Σφάλμα κατά τη λήψη υποκατηγοριών για την κατηγορία ${categoryId}:`, error);
            });
    }
});
