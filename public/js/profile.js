import  getUserFromCookie  from '../getUserFromCookie.js';
    const user = getUserFromCookie();
    if(!user) {
        window.location.href = '/login';
    }
    
    // Wait for the DOM to be ready
document.addEventListener("DOMContentLoaded", function(event) {
        const username = document.querySelector('.username');
        const phone = document.querySelector('.phone');
        const bloodType = document.querySelector('.bloodType');
        const shiftDays = document.querySelector('.shiftDays');
        const role = document.querySelector('.role');
        const profileImg = document.getElementById('prof-img');
        username.textContent = user.username;
        phone.textContent = user.phone;
        bloodType.textContent = user.bloodType;
        shiftDays.textContent = user.shiftDays;
        role.textContent = user.role.name;
        console.log(profileImg);
        if(user.profileImage) {
            profileImg.innerHTML = `<img src="${user.profileImage}" id="img" alt="profile image">`;
        } else {
            profileImg.innerHTML = `<i style="font-size:50px;margin-top: 20px;" id="img" class='bx bxs-user-circle icon'></i>`;
        }   
});