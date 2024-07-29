import { uploadImage } from './imageUpload.js';

document.getElementById('materialForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const phone_nb = document.getElementById('phone_nb').value;
    const imageFile = document.getElementById('image').files[0];
    const imageInput = document.getElementById('image');
    const form = event.target;
    const hidden = document.getElementById('hidden');
    

    if (name === '') {
        showAlert('Name is required');
        return;
    }
    if(!phone_nb){
        showAlert('Phone number is required');
        return;
    }
    if (!imageFile) {  
        showAlert('Image is required');
        return;
    }

    try {
        const imageURL = await uploadImage(imageFile, "borrowed-items-onBorrow-images");
       
        hidden.value = imageURL;

        // Set form action and method
        form.method = 'POST';
        // Submit the form
        form.submit();
    } catch (error) {
        console.error(error);
        showAlert('An error occurred');
    }
});


const showAlert = (message) => {
    const alert = document.getElementById('alert');
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alert.style.display = 'block';
};

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('alert').style.display = 'none';
});
