document.addEventListener('DOMContentLoaded', function() {
    // Form Validation
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Reset error messages
            const errorMessages = document.querySelectorAll('.error-message');
            errorMessages.forEach(msg => {
                msg.style.display = 'none';
                msg.textContent = '';
            });
            
            // Validate form fields
            let isValid = true;
            
            // Name validation
            const nameInput = document.getElementById('name');
            if (nameInput.value.trim() === '') {
                showError('nameError', 'Please enter your name');
                isValid = false;
            } else if (nameInput.value.trim().length < 2) {
                showError('nameError', 'Name must be at least 2 characters');
                isValid = false;
            }
            
            // Email validation
            const emailInput = document.getElementById('email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                showError('emailError', 'Please enter your email');
                isValid = false;
            } else if (!emailRegex.test(emailInput.value)) {
                showError('emailError', 'Please enter a valid email');
                isValid = false;
            }
            
            // Phone validation (optional)
            const phoneInput = document.getElementById('phone');
            if (phoneInput.value.trim() !== '') {
                const phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
                if (!phoneRegex.test(phoneInput.value)) {
                    showError('phoneError', 'Please enter a valid phone number');
                    isValid = false;
                }
            }
            
            // Subject validation
            const subjectInput = document.getElementById('subject');
            if (subjectInput.value === null || subjectInput.value === '') {
                showError('subjectError', 'Please select a subject');
                isValid = false;
            }
            
            // Message validation
            const messageInput = document.getElementById('message');
            if (messageInput.value.trim() === '') {
                showError('messageError', 'Please enter your message');
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                showError('messageError', 'Message must be at least 10 characters');
                isValid = false;
            }
            
            // If form is valid, submit it
            if (isValid) {
                // In a real application, you would send the form data to the server here
                // For this example, we'll simulate a successful submission
                
                // Show loading state on button
                const submitBtn = document.querySelector('.submit-btn');
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span class="btn-text">Sending...</span>';
                
                // Simulate API call delay
                setTimeout(() => {
                    // Hide form and show success message
                    contactForm.style.display = 'none';
                    successMessage.style.display = 'block';
                    
                    // Reset form after submission
                    contactForm.reset();
                    
                    // Reset button state (in case form is shown again)
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<span class="btn-text">Send Message</span><span class="btn-icon"><i class="fas fa-paper-plane"></i></span>';
                }, 1500);
            }
        });
    }
    
    function showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // Add error class to input
        const inputId = elementId.replace('Error', '');
        const inputElement = document.getElementById(inputId);
        if (inputElement) {
            inputElement.style.borderColor = 'var(--error)';
            
            // Remove error style when user starts typing
            inputElement.addEventListener('input', function() {
                if (this.value.trim() !== '') {
                    this.style.borderColor = 'var(--border)';
                    errorElement.style.display = 'none';
                }
            }, { once: true });
        }
    }
    
    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    faqQuestions.forEach(question => {
        question.addEventListener('click', function() {
            this.classList.toggle('active');
            const answer = this.nextElementSibling;
            
            if (this.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = '0';
            }
            
            // Close other open FAQs
            faqQuestions.forEach(q => {
                if (q !== question && q.classList.contains('active')) {
                    q.classList.remove('active');
                    q.nextElementSibling.style.maxHeight = '0';
                }
            });
        });
    });
    
    // Phone input formatting
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            const input = e.target.value.replace(/\D/g, '').substring(0, 10);
            const areaCode = input.substring(0, 3);
            const middle = input.substring(3, 6);
            const last = input.substring(6, 10);
            
            if (input.length > 6) {
                e.target.value = `(${areaCode}) ${middle}-${last}`;
            } else if (input.length > 3) {
                e.target.value = `(${areaCode}) ${middle}`;
            } else if (input.length > 0) {
                e.target.value = `(${areaCode}`;
            }
        });
    }
    
    // Animate form elements on scroll
    const animateOnScroll = function() {
        const formElements = document.querySelectorAll('.contact-form .form-group, .submit-btn');
        
        formElements.forEach((element, index) => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                setTimeout(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    };
    
    // Set initial state for animation
    const formGroups = document.querySelectorAll('.contact-form .form-group, .submit-btn');
    formGroups.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    });
    
    // Run on load and scroll
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
});