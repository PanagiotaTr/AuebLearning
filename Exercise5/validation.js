window.addEventListener('load', function(){

    let form = document.getElementById("register-form")

    let birthdayEntered = form.birth-date

    birthdayEntered.addEventListener('change', function(){
        const current = new Date()
        const birthdate = new Date(birthdayEntered.value)

        let age = current.getFullYear() - birthdate.getFullYear();
        const monthDifference = current.getMonth() - birthdate.getMonth();
        const dayDifference = current.getDate() - birthdate.getDate();

        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        if(age < 18 ){
            birthdayEntered.setCustomValidity('Η πλατφόρμα απευθύνεται σε άτομα άνω των 18 ετών!')
        }else{
            birthdayEntered.setCustomValidity("")
        }
    })

    let firstCode = form.password
    let secondCode = form.verify_password

    secondCode.addEventListener('change', function(){
        if(firstCode.value !== secondCode.value){
            secondCode.setCustomValidity('Οι δύο κωδικοί δεν ταιριάζουν')
        }else{
            secondCode.setCustomValidity("")
        }
    })

    firstCode.addEventListener('change', function(){
        if(firstCode.value !== secondCode.value){
            secondCode.setCustomValidity('Οι δύο κωδικοί δεν ταιριάζουν')
        }else{
            secondCode.setCustomValidity("")
        }
    })

    let button = form.register_btn

    button.addEventListener('click', function(){

        let checkboxes = form.querySelectorAll('.container input[type="checkbox"]')
        let uncheckboxes = form.querySelectorAll('.container input[type="checkbox"]:not(:checked)')
        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })

    button.addEventListener('click', function(){

        let checkboxes = form.querySelectorAll('.container-sector input[type="checkbox"]')
        let uncheckboxes = form.querySelectorAll('.container-sector input[type="checkbox"]:not(:checked)')

        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })

    button.addEventListener('click', function(){

        let checkboxes = form.querySelectorAll('.container-language input[type="checkbox"]')
        let uncheckboxes = form.querySelectorAll('.container-language input[type="checkbox"]:not(:checked)')

        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })
})