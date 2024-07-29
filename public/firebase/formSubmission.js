import { uploadImage } from "./imageUpload.js";
document.querySelector(".profile-f").addEventListener("submit", async (event) => {
  event.preventDefault();

  const fileInput = document.querySelector("#profileImage");
  const file = fileInput.files[0];
  const hiddenImageInput = document.getElementById("image");
  const phone = document.getElementById("phone").value;
  const bloodType = document.getElementById("bloodType").value;
  const error = document.getElementById("alert");
  const alertMessage = document.getElementById("alertMessage");

  if (file) {
    try {
      const downloadURL = await uploadImage(file, "profile-images");
      // Set the hidden input's value to the download URL
      hiddenImageInput.value = downloadURL;
      console.log(hiddenImageInput.value);
    //   Validate phone number and blood type
    if (phone.length !== 8) {
        console.log(phone.length);
        alertMessage.innerText = "Phone number must be 11 digits";
        error.style.display = "block";
        return;
    }
    if (bloodType === "") {
        console.log(bloodType);
        alertMessage.innerText = "Please select a blood type";
        error.style.display = "block";
        return;
    }
    // Submit the form
    event.target.action = "/profile/edit";
    event.target.method = "POST";
    event.target.submit();

    } catch (error) {
        console.error("Error uploading file:", error);
        alertMessage.innerText = "Error uploading file";
        error.style.display = "block";

    }
  } else {
    event.target.action = "/profile/edit";
    event.target.method = "POST";
    event.target.submit();
  }
});
