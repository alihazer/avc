function toggleOtherInput(id) {
    const selectElement = document.getElementById(id);
    const otherInputElement = document.getElementById(`${id}Other`);
    if (selectElement.value === "Other") {
        otherInputElement.style.display = "inline";
        otherInputElement.required = true;
    } else {
        otherInputElement.style.display = "none";
        otherInputElement.required = false;
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const selects = document.querySelectorAll('select');
    selects.forEach(select => {
        select.addEventListener('change', function() {
            toggleOtherInput(this.id);
        });
    });
});
