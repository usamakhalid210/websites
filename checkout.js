document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.checkout-step');
    const stepIndicators = document.querySelectorAll('.checkout-steps .step');
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const placeOrderBtn = document.querySelector('.place-order');
    let currentStep = 0;

    // Load cart items from storage or backend
    function loadCartItems() {
        // This would come from your backend or localStorage
        const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
        const orderItems = document.querySelector('.order-items');
        const subtotalElement = document.querySelector('.subtotal');
        const totalElement = document.querySelector('.total');
        
        let subtotal = 0;
        orderItems.innerHTML = '';
        
        cartItems.forEach(item => {
            subtotal += item.price * item.quantity;
            orderItems.innerHTML += `
                <div class="order-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        });
        
        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${(subtotal + 5.99).toFixed(2)}`;
    }

    // Navigation between steps
    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle('active', index === stepIndex);
        });
        
        stepIndicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === stepIndex);
        });
        
        currentStep = stepIndex;
    }

    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep < steps.length - 1) {
                showStep(currentStep + 1);
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (currentStep > 0) {
                showStep(currentStep - 1);
            }
        });
    });

    // Payment method selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    paymentMethods.forEach(method => {
        method.addEventListener('click', function() {
            paymentMethods.forEach(m => m.classList.remove('active'));
            this.classList.add('active');
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
        });
    });

    // Place order
    placeOrderBtn.addEventListener('click', function(e) {
        e.preventDefault();
        // Process order with backend
        alert('Order placed successfully!');
        localStorage.removeItem('cart');
        window.location.href = 'thank-you.html';
    });

    // Initialize
    loadCartItems();
});