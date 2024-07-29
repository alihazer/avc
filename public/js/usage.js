const addBtn = document.getElementById('add');
const materialsSelect = document.getElementById('usage');
const quantityInput = document.getElementById('quantity');
const addedCon = document.querySelector('.added-con');
const hiddenInput = document.getElementById('materials');

const materials = [];

// Add event listener for the Add button
addBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const materialId = materialsSelect.value;
    const materialName = materialsSelect.options[materialsSelect.selectedIndex].text;
    const quantity = quantityInput.value;

    // Validation checks
    if (quantity === '') {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Please enter a quantity!',
        });
        return;
    }
    if (quantity <= 0) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Quantity must be greater than 0!',
        });
        return;
    }

    // Check if the material is already added and update the quantity if it is
    const addedItems = document.querySelectorAll('.added-item');
    let itemExists = false;
    addedItems.forEach(item => {
        const existingMaterialId = item.querySelector('input[name="materials"]').value;
        if (existingMaterialId === materialId) {
            const quantityInput = item.querySelector('input[name="quantity"]');
            quantityInput.value = parseInt(quantityInput.value) + parseInt(quantity);
            item.querySelector('p').textContent = `${materialName} - ${quantityInput.value}`;
            itemExists = true;
        }
    });

    // If the material is not already added, create a new div element
    if (!itemExists) {
        const div = document.createElement('div');
        div.classList.add('added-item');
        div.innerHTML = `
            <p>${materialName} - ${quantity}</p>
            <input type="hidden" name="materials" value="${materialId}">
            <input type="hidden" name="quantity" value="${quantity}">
            <button class="btn btn-danger remove">Remove</button>
        `;
        addedCon.appendChild(div);

        // Add the new item to the materials array
        materials.push({_id: materialId, quantity: quantity});

        // Add event listener to remove button
        const removeBtn = div.querySelector('.remove');
        removeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            div.remove();

            // Remove item from the materials array
            const index = materials.findIndex(item => item._id === materialId);
            if (index !== -1) {
                materials.splice(index, 1);
            }

            // Update the hidden input
            hiddenInput.value = JSON.stringify(materials);
        });
    }

    // Clear the quantity input
    quantityInput.value = 1;

   
    hiddenInput.value = JSON.stringify(materials);
    console.log(hiddenInput.value);
});

