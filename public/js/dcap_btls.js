    const dcap_btls = {
        d: false,
        c: false,
        a: false,
        p: false,
        b: false,
        t: false,
        l: false,
        s: false
    }

if(document.getElementById("dcap-btls") !== null){

    const checkboxes = document.querySelectorAll('.dcap-btls-letter input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            dcap_btls[this.id] = this.checked;
            const hiddenDcap = 
            document.getElementById('dcap_btls');
            hiddenDcap.value = JSON.stringify(dcap_btls);
        });
    });
}


