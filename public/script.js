// SIDEBAR DROPDOWN
const allDropdown = document.querySelectorAll('#sidebar .side-dropdown');
const sidebar = document.getElementById('sidebar');

allDropdown.forEach(item=> {
	const a = item.parentElement.querySelector('a:first-child');
	a.addEventListener('click', function (e) {
		e.preventDefault();

		if(!this.classList.contains('active')) {
			allDropdown.forEach(i=> {
				const aLink = i.parentElement.querySelector('a:first-child');

				aLink.classList.remove('active');
				i.classList.remove('show');
			})
		}

		this.classList.toggle('active');
		item.classList.toggle('show');
	})
})





// SIDEBAR COLLAPSE
const toggleSidebar = document.querySelector('nav .toggle-sidebar');
const allSideDivider = document.querySelectorAll('#sidebar .divider');

if(sidebar.classList.contains('hide')) {
	allSideDivider.forEach(item=> {
		item.textContent = '-'
	})
	allDropdown.forEach(item=> {
		const a = item.parentElement.querySelector('a:first-child');
		a.classList.remove('active');
		item.classList.remove('show');
	})
} else {
	allSideDivider.forEach(item=> {
		item.textContent = item.dataset.text;
	})
}

toggleSidebar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');

	if(sidebar.classList.contains('hide')) {
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})

		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
	} else {
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})




sidebar.addEventListener('mouseleave', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = '-'
		})
	}
})



sidebar.addEventListener('mouseenter', function () {
	if(this.classList.contains('hide')) {
		allDropdown.forEach(item=> {
			const a = item.parentElement.querySelector('a:first-child');
			a.classList.remove('active');
			item.classList.remove('show');
		})
		allSideDivider.forEach(item=> {
			item.textContent = item.dataset.text;
		})
	}
})




// PROFILE DROPDOWN

document.addEventListener('DOMContentLoaded', (event) => {
		const profile = document.querySelector('nav .profile');
		const dropdownProfile = profile.querySelector('.profile-link');
		const imgProfile = document.getElementById('img');
		imgProfile.addEventListener('click', function () {
		dropdownProfile.classList.toggle('show');
	})
})





// MENU
const allMenu = document.querySelectorAll('main .content-data .head .menu');

allMenu.forEach(item=> {
	const icon = item.querySelector('.icon');
	const menuLink = item.querySelector('.menu-link');

	icon.addEventListener('click', function () {
		menuLink.classList.toggle('show');
	})
})



window.addEventListener('click', function (e) {
	const profile = document.querySelector('nav .profile');

	const imgProfile = document.getElementById('img');
	const dropdownProfile = profile.querySelector('.profile-link');

	if(e.target !== imgProfile) {
		if(e.target !== dropdownProfile) {
			if(dropdownProfile.classList.contains('show')) {
				dropdownProfile.classList.remove('show');
			}
		}
	}

	allMenu.forEach(item=> {
		const icon = item.querySelector('.icon');
		const menuLink = item.querySelector('.menu-link');

		if(e.target !== icon) {
			if(e.target !== menuLink) {
				if (menuLink.classList.contains('show')) {
					menuLink.classList.remove('show')
				}
			}
		}
	})
})


const closeBtn = document.getElementById("closeBtn");
const alertElement = document.getElementById("alert");

// Add event listener to the close button

if(closeBtn){
	closeBtn.addEventListener("click", function () {
		alertElement.style.display = "none";
	});	
}

const btn = document.querySelector('.btn');
if(btn){
	btn.addEventListener('click', ()=>{
		setTimeout(()=>{
			btn.disabled = true;
		}, 100);
		setTimeout(()=>{
			btn.disabled = false;
		}, 5000);
	}
	);
}

const form1 = document.querySelector('form');
if(form1){
	form1.addEventListener('submit', () => {
		form1.querySelector('button').setAttribute('disabled', 'disabled');
	});
}

$(document).ready(function() {
	$('.rescuer-select').select2({
		placeholder: "Select..",
		allowClear: true,
		maximumSelectionLength: 6
	});

	$('.moi-select').select2({
		placeholder: "Select..",
		allowClear: true
	});

	$('.person-select').select2({
		placeholder: "Select..",
		allowClear: true,
		maximumSelectionLength: 1
	});

	$('.ppte-group').hide();

	$('#avpu').change(function() {
		if ($(this).val() === 'Alert') {
			$('.ppte-group').show();
		} else {
			$('.ppte-group').hide();
		}
	});
});

$(document).ready(function () {
    const $speedoMeterValue = $('#speedoMeterValue');
    const $litersCount = $('#litersCount');
    const $companyInput = $('#companyInput');
    const $companyInputOil = $('#companyInputOil');
    const $companyInputBenzine = $('#companyInputBenzine');
    const $carCostCause = $('#carCostCause');

    // Initially hide all optional fields
    const hideFields = () => {
        $speedoMeterValue.hide().removeAttr('required');
        $litersCount.hide().removeAttr('required');
        $companyInput.hide().removeAttr('required').removeAttr('name');
        $companyInputOil.hide().removeAttr('required').removeAttr('name');
        $companyInputBenzine.hide().removeAttr('required').removeAttr('name');
    };

    hideFields();

    const handleCompanyInputChange = ($input, $dependent) => {
        $input.change(function () {
            if ($(this).val() === 'other') {
                $companyInput.show().attr('required', 'required');
                $dependent.removeAttr('required');
            } else {
                $companyInput.hide().removeAttr('required');
            }
        });
    };

    $carCostCause.change(function () {
        const value = $(this).val();
        hideFields();

        switch (value) {
            case 'oilchange':
                $speedoMeterValue.show().attr('required', 'required');
                $companyInputOil.show().attr('required', 'required').attr('name', 'paidFor');
                handleCompanyInputChange($companyInputOil, $companyInputOil);
                break;

            case 'benzine':
                $litersCount.show().attr('required', 'required');
                $companyInputBenzine.show().attr('required', 'required').attr('name', 'paidFor');
                handleCompanyInputChange($companyInputBenzine, $companyInputBenzine);
                break;

            case 'maintenance':
                $companyInput.show().attr('required', 'required').attr('name', 'paidFor');
                break;

            default:
                break;
        }
    });
});


const triageForm = document.getElementById('triageForm');
if(triageForm){
	triageForm.addEventListener("submit", function(e) {
		let form = e.target;
		let submitBtn = document.getElementById("submitBtn");
	 
		// Check if form is valid using HTML5 validation
		if (!form.checkValidity()) {
		    e.preventDefault(); // Stop submission
		    form.reportValidity(); // Show built-in validation messages
		    submitBtn.disabled = false; // Re-enable the button
		} else {
		    submitBtn.disabled = true; // Disable only if valid
		}
		console.log(submitBtn.disabled);
	 });
}