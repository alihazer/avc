import { uploadImage } from './imageUpload.js';

document.getElementById('materialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const url = new URL(window.location.href).pathname.split('/');

    const id = document.getElementById('id').value;
    if (!id) {
        showAlert('Invalid item');
        return;
    }

    const alertMessage = document.getElementById('alertMessage');
    const error = document.getElementById('alert');
    const imageInput = document.getElementById('image');
    const notes = document.getElementById('notes');
    const loadingSpinner = document.getElementById('loadingSpinner');

    // Reset error message
    alertMessage.innerText = '';
    error.style.display = 'none';

    const imageFile = imageInput.files[0];
    if (!imageFile) {
        alertMessage.innerText = 'Image is required';
        error.style.display = 'block';
        return;
    }

    // Show loading spinner
    loadingSpinner.style.display = 'flex';

    try {
        const imageURL = await uploadImage(imageFile, "borrowed-items-images");

        // Create the data object
        const data = {
            imageOnReturn: imageURL,
            notes: notes.value
        };

        // Make the PUT request
        fetch(`/borrowed-items/return/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(data => {
            // Hide loading spinner
            loadingSpinner.style.display = 'none';

            if (data.status) {
                window.location.href = '/borrowed-items/category/' + url[3] + '/items';
            } else {
                showAlert(data.message);
            }
        })
        .catch(err => {
            showAlert('An error occurred');
            // Hide loading spinner
            loadingSpinner.style.display = 'none';
        });

        // Reset the file input value
        imageInput.value = '';

    } catch (error) {
        console.error('Error uploading file:', error);
        alertMessage.innerText = 'Error uploading file';
        error.style.display = 'block';
        // Hide loading spinner
        loadingSpinner.style.display = 'none';
    }
});

const showAlert = (message) => {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alert.style.display = 'block';
    // Hide loading spinner
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'none';
};

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('alert').style.display = 'none';
});
