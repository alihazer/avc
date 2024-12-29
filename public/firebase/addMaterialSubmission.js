
import { uploadImage } from './imageUpload.js';

document.getElementById('materialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    let name = document.getElementById('name').value;
    let quantity = document.getElementById('quantity').value;
    let imageFile = document.getElementById('image').files[0];
    const alertMessage = document.getElementById('alertMessage');
    const error = document.getElementById('alert');
    let imageInput = document.getElementById('image1');

    if (imageFile) {
        try {
            const imageURL = await uploadImage(imageFile, "material-images");
            // Validate name and quantity
            if (name === '') {
                alertMessage.innerText = 'Name is required';
                error.style.display = 'block';
                return;
            }
            if (quantity === '') {
                alertMessage.innerText = 'Quantity is required';
                error.style.display = 'block';
                return;
            }
        
            imageInput.value = imageURL;

            // Submit the form
            event.target.action = '/materials';
            event.target.method = 'POST';
            event.target.submit();

            // event.target.submit();
        } catch (error) {
            console.error('Error uploading file:', error);
            alertMessage.innerText = 'Error uploading file';
            error.style.display = 'block';
        }
    } else {
        alertMessage.innerText = 'Image is required';
        error.style.display = 'block';
    }
});
