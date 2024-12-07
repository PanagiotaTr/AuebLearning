// Εύρεση τμημάτων κώδικα - αναζήτηση με βάση τα παρακάτω σχόλια
// 1. τσεκάρουμε την ηλικία των χρηστών μιας και απαγορεύουμε την είσοδο κάτων των 18
// 2. τσεκάρουμε τους 2 κωδικούς εισόδου, για να διαπιστώσουμε ότι είναι ίδιοι
// 3. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένας τρόπος επικοινωνίας
// 4. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένας τομέας ενδιαφέροντος
// 5. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένα box που αφορά την εκμάθηση ξένων γλωσσών

window.addEventListener('load', function(){

    // παίρνουμε τα στοιχεία του document παίρνοντας το id που είναι register-form
    let form = document.getElementById("register-form")

    // 1. τσεκάρουμε την ηλικία των χρηστών μιας και απαγορεύουμε την είσοδο κάτων των 18

    // παίρνουμε την ημ/νια που δόθηκε ως είσοδο
    let birthdayEntered = form.birthdate

    // καλούμε έναν event listener για να ελέγξουμε την ημ/νια όταν εκείνη αλλάζει
    birthdayEntered.addEventListener('change', function(){
        // παίρνουμε την σημερινή ημ/νια
        const current = new Date()
        // μετατρέπουμε την ημ/νια που δόθηκε ως είσοδο, σε Date αντικείμενο
        const birthdate = new Date(birthdayEntered.value)

        // Υπολογίζουμε την διαφορά των δύο ημ/νιων βάσει του χρόνου/year
        let age = current.getFullYear() - birthdate.getFullYear();
        // Υπολογίζουμε την διαφορά των δύο ημ/νιων βάσει του μήνα/month
        const monthDifference = current.getMonth() - birthdate.getMonth();
        // Υπολογίζουμε την διαφορά των δύο ημ/νιων βάσει της ημέρας/day
        const dayDifference = current.getDate() - birthdate.getDate();

        // αν η διαφορά των δύο ημ/νιων βάσει του μήνα/month είναι αρνητική ή
        // αν η διαφορά των δύο ημ/νιων βάσει του μήνα/month είναι μηδέν 
        // και η διαφορά των δύο ημ/νιων βάσει της ημέρας/day είναι αρνητική, τότε μειώνουμε κατά 1 την μεταβλητή age
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }

        // αν η μεταβλητή age είναι κάτω των 18, απαγορεύουμε την εγγραφή (σχετικό μήνυμα)
        if(age < 18 ){
            birthdayEntered.setCustomValidity('Η πλατφόρμα απευθύνεται σε άτομα άνω των 18 ετών!')
        }else{
            birthdayEntered.setCustomValidity("")
        }
    })

    // 2. τσεκάρουμε τους 2 κωδικούς εισόδου, για να διαπιστώσουμε ότι είναι ίδιοι

    // παίρνουμε τον κωδικό που δόθηκε ως είσοδο
    let firstCode = form.password
    // παίρνουμε τον επιβεβαιωμένο κωδικό που δόθηκε ως είσοδο
    let secondCode = form.verify_password

    // καλούμε έναν event listener για να ελέγξουμε τον δεύτερο κωδικό όταν εκείνος αλλάζει
    secondCode.addEventListener('change', function(){
        // αν οι δύο κωδικοί δεν είναι ίδιοι, τότε εμφανίζουμε σχετικό μήνυμα
        if(firstCode.value !== secondCode.value){
            secondCode.setCustomValidity('Οι δύο κωδικοί δεν ταιριάζουν')
        }else{
            secondCode.setCustomValidity("")
        }
    })

    // καλούμε έναν event listener για να ελέγξουμε τον πρώτο κωδικό όταν εκείνος αλλάζει 
    // στην περίπτωση που ο χρήστης έχει πληκτρολογήσει πρώτα τον επιβεβαιωμένο κωδικό και μετά τον κωδικό
    firstCode.addEventListener('change', function(){
        // αν οι δύο κωδικοί δεν είναι ίδιοι, τότε εμφανίζουμε σχετικό μήνυμα
        if(firstCode.value !== secondCode.value){
            secondCode.setCustomValidity('Οι δύο κωδικοί δεν ταιριάζουν')
        }else{
            secondCode.setCustomValidity("")
        }
    })

    // παίρνουμε το button της εγγραφής
    let button = form.register_btn

    // 3. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένας τρόπος επικοινωνίας

    // καλούμε έναν event listener όταν γίνεται κλικ στο κουμπί της εγγραφής
    button.addEventListener('click', function(){

        // παίρνουμε τα κουτάκια που έχουν επιλεγεί από τον χρήστη 
        let checkboxes = form.querySelectorAll('.container input[type="checkbox"]')
        // παίρνουμε όλα τα κουτάκια που έχουμε
        let uncheckboxes = form.querySelectorAll('.container input[type="checkbox"]:not(:checked)')

        // αν το μέγεθος των επιλεγμένων κουτιών είναι ίδιο με το μέγεθος όλων των κουτιών, 
        // τότε εμφανίζουμε μήνυμα επιλογής (να επιλεχθεί τουλάχιστον ένα)
        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })

    // 4. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένας τομέας ενδιαφέροντος

    // καλούμε έναν event listener όταν γίνεται κλικ στο κουμπί της εγγραφής
    button.addEventListener('click', function(){

        // παίρνουμε τα κουτάκια που έχουν επιλεγεί από τον χρήστη 
        let checkboxes = form.querySelectorAll('.container-sector input[type="checkbox"]')
        // παίρνουμε όλα τα κουτάκια που έχουμε
        let uncheckboxes = form.querySelectorAll('.container-sector input[type="checkbox"]:not(:checked)')

        // αν το μέγεθος των επιλεγμένων κουτιών είναι ίδιο με το μέγεθος όλων των κουτιών, 
        // τότε εμφανίζουμε μήνυμα επιλογής (να επιλεχθεί τουλάχιστον ένα)
        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })

    // 5. τσεκάρουμε να έχει επιλεγεί τουλάχιστον ένα box που αφορά την εκμάθηση ξένων γλωσσών

    // καλούμε έναν event listener όταν γίνεται κλικ στο κουμπί της εγγραφής
    button.addEventListener('click', function(){

        // παίρνουμε τα κουτάκια που έχουν επιλεγεί από τον χρήστη 
        let checkboxes = form.querySelectorAll('.container-language input[type="checkbox"]')
        // παίρνουμε όλα τα κουτάκια που έχουμε
        let uncheckboxes = form.querySelectorAll('.container-language input[type="checkbox"]:not(:checked)')

        // αν το μέγεθος των επιλεγμένων κουτιών είναι ίδιο με το μέγεθος όλων των κουτιών, 
        // τότε εμφανίζουμε μήνυμα επιλογής (να επιλεχθεί τουλάχιστον ένα)
        if(checkboxes.length === uncheckboxes.length){
            checkboxes[0].setCustomValidity('Επιλέξτε τουλάχιστον ένα')
        }else{
            checkboxes[0].setCustomValidity("")
        }

    })
})