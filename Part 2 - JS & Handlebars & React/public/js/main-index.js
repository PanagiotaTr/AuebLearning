const baseUrl = "https://learning-hub-1whk.onrender.com";

var templates = {}

document.addEventListener('DOMContentLoaded', () => {
    const categoriesListContainer = document.querySelector("#categories-list");

    let headers = new Headers();
    headers.append('Accept', 'application/json');

    let init = {
        method: "GET",
        headers: headers
    };

    fetch(`${baseUrl}/categories`, init)
        .then(categoriesResponse => categoriesResponse.json())
        .then(categoriesList => {
            fetch(`${baseUrl}/subcategories`, init)
                .then(subcategoriesResponse => subcategoriesResponse.json())
                .then(subcategoriesList => {
                    categoriesList.forEach(category => {
                        category.subcategories = subcategoriesList
                            .filter(subcategory => subcategory.category_id === category.id)
                            .map(subcategory => ({
                                ...subcategory,
                                img_url: `${baseUrl}/${subcategory.img_url}`
                            }));

                        category.img_url = `${baseUrl}/${category.img_url}`;
                    });

                    let categoryTemplate = document.getElementById('categories-template');
                    templates.compiledTemplate = Handlebars.compile(categoryTemplate.textContent);
                    let categoriesContent = templates.compiledTemplate({ categories: categoriesList });

                    categoriesListContainer.innerHTML = categoriesContent;
                })
                .catch(error => {
                    console.error("Σφάλμα κατά τη λήψη των υποκατηγοριών:", error);
                    categoriesListContainer.innerHTML = "<p>Αποτυχία φόρτωσης υποκατηγοριών.</p>";
                });
        })
        .catch(error => {
            console.error("Σφάλμα κατά τη λήψη των κατηγοριών:", error);
            categoriesListContainer.innerHTML = "<p>Αποτυχία φόρτωσης κατηγοριών.</p>";
        });
});
