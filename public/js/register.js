        // Function to initialize checkboxes and handle selected days
        function initializeCheckboxes() {
            // Select all checkboxes
            const checkboxes = document.querySelectorAll('input[type="checkbox"]');
            
            // Function to update selectedDays array
            function updateSelectedDays() {
                let selectedDays = []; // Reset array
                checkboxes.forEach(function(checkbox) {
                    if (checkbox.checked) {
                        selectedDays.push(checkbox.value); // Add checked value to array
                    }
                });
                return selectedDays;
            }
            
            // Add event listener to each checkbox
            checkboxes.forEach(function(checkbox) {
                checkbox.addEventListener('change', function() {
                    const selectedDays = updateSelectedDays();
                });
            });
    
            // Return updateSelectedDays function for accessibility
            return updateSelectedDays;
        }
    
        // Function to validate form inputs
        function validateForm() {
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const phoneNumber = document.getElementById('phoneNumber').value;
            const role = document.querySelector('.select').value;
            const shifDays = document.getElementById('shifDays');
            const form = document.querySelector('form');
            const alert = document.getElementById('alert');

            
            // Get selected days using updateSelectedDays function
            const updateSelectedDays = initializeCheckboxes(); // Initialize checkboxes and get updateSelectedDays function
            let selectedDays = updateSelectedDays(); // Call updateSelectedDays to get selected days array
            selectedDays = selectedDays.join(', '); // Convert array to string
            shifDays.value = selectedDays; // Assign selected days to hidden input

    
            if (username === "" || password === "" || phoneNumber === "" || role === "" || selectedDays.length === 0) {
                alert.innerHTML = "All fields are required";
                alert.style.display = "block";
                return false;
            } else {
                form.action = "/register";
                form.method = "POST";
                form.submit();
                return true;
            }
        }
    
        // Function to initialize form validation
        function initializeFormValidation() {
            const form = document.querySelector('form');
            form.addEventListener('submit', function(event) {
                event.preventDefault(); // Prevent form submission for demo
                validateForm();
            });
        }
    
        // Wait for the DOM to fully load
        document.addEventListener('DOMContentLoaded', function() {
            initializeCheckboxes(); // Initialize checkboxes and updateSelectedDays
            initializeFormValidation(); // Initialize form validation
        });