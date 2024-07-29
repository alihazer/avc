import { uploadImage } from './imageUpload.js';

document.getElementById('materialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const imageFile = document.getElementById('image').files[0];
    const alertMessage = document.getElementById('alertMessage');
    const error = document.getElementById('alert');
    const imageInput = document.getElementById('image1');
    const form = event.target;
    
    // Reset error message
    alertMessage.innerText = '';
    error.style.display = 'none';

    if (name === '') {
        alertMessage.innerText = 'Name is required';
        error.style.display = 'block';
        return;
    }
    if (!imageFile) {
        alertMessage.innerText = 'Image is required';
        error.style.display = 'block';
        return;
    }

    try {
        const imageURL = await uploadImage(imageFile, "borrowed-items-images");
        imageInput.value = imageURL;

        // Set form action and method
        form.method = 'POST';
        // Submit the form
        form.submit();
    } catch (error) {
        console.error('Error uploading file:', error);
        alertMessage.innerText = 'Error uploading file';
        error.style.display = 'block';
    }
});
