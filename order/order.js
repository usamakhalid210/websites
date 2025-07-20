document.addEventListener('DOMContentLoaded', function() {
    // Order Progress Navigation
    const steps = document.querySelectorAll('.step');
    const orderSections = document.querySelectorAll('.order-section');
    
    steps.forEach(step => {
        step.addEventListener('click', function() {
            const stepNumber = parseInt(this.getAttribute('data-step'));
            navigateToStep(stepNumber);
        });
    });
    
    function navigateToStep(stepNumber) {
        // Update progress steps
        steps.forEach((step, index) => {
            if (index < stepNumber) {
                step.classList.add('completed');
                step.classList.add('active');
            } else if (index === stepNumber - 1) {
                step.classList.add('active');
                step.classList.remove('completed');
            } else {
                step.classList.remove('active');
                step.classList.remove('completed');
            }
        });
        
        // Show corresponding section
        orderSections.forEach((section, index) => {
            if (index === stepNumber - 1) {
                section.classList.add('active');
            } else {
                section.classList.remove('active');
            }
        });
    }
    
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let shippingInfo = JSON.parse(localStorage.getItem('shippingInfo')) || null;
    
    // Render cart items
    function renderCartItems() {
        const cartItemsContainer = document.querySelector('.cart-items');
        const emptyCart = document.querySelector('.empty-cart');
        const checkoutBtn = document.querySelector('.checkout-btn');
        
        if (cart.length === 0) {
            emptyCart.style.display = 'block';
            checkoutBtn.disabled = true;
            cartItemsContainer.innerHTML = '';
            cartItemsContainer.appendChild(emptyCart);
            return;
        }
        
        emptyCart.style.display = 'none';
        checkoutBtn.disabled = false;
        
        let cartHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            cartHTML += `
                <div class="cart-item" data-id="${item.id}">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <div class="item-options">
                            <span class="item-color">Color: ${item.color || 'Black'}</span>
                            <span class="item-size">Size: ${item.size || 'M'}</span>
                        </div>
                        <div class="item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                    <div class="item-actions">
                        <div class="quantity-selector">
                            <button class="quantity-btn minus">-</button>
                            <input type="number" value="${item.quantity}" min="1" class="quantity-input">
                            <button class="quantity-btn plus">+</button>
                        </div>
                        <button class="remove-item">
                            <i class="fas fa-trash"></i> Remove
                        </button>
                    </div>
                </div>
            `;
        });
        
        cartItemsContainer.innerHTML = cartHTML;
        
        // Update summary
        updateOrderSummary(subtotal);
        
        // Add event listeners to quantity controls
        document.querySelectorAll('.quantity-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                const input = this.parentElement.querySelector('.quantity-input');
                let quantity = parseInt(input.value);
                
                if (this.classList.contains('minus') && quantity > 1) {
                    quantity--;
                } else if (this.classList.contains('plus')) {
                    quantity++;
                }
                
                input.value = quantity;
                updateCartItem(itemId, quantity);
            });
        });
        
        // Add event listeners to remove buttons
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').getAttribute('data-id');
                removeCartItem(itemId);
            });
        });
    }
    
    // Update cart item quantity
    function updateCartItem(itemId, quantity) {
        const itemIndex = cart.findIndex(item => item.id === itemId);
        if (itemIndex !== -1) {
            cart[itemIndex].quantity = quantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
        }
    }
    
    // Remove item from cart
    function removeCartItem(itemId) {
        cart = cart.filter(item => item.id !== itemId);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }
    
    // Update order summary
    function updateOrderSummary(subtotal) {
        document.querySelector('.subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.total').textContent = `$${subtotal.toFixed(2)}`;
        
        // Update item count in summary
        const itemCount = cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelector('.summary-row span:first-child').textContent = `Subtotal (${itemCount} ${itemCount === 1 ? 'item' : 'items'})`;
    }
    
    // Proceed to shipping
    document.querySelector('.checkout-btn')?.addEventListener('click', function() {
        navigateToStep(2);
        renderShippingReview();
    });
    
    // Render shipping review section
    function renderShippingReview() {
        const reviewItems = document.querySelector('.review-items');
        let reviewHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            reviewHTML += `
                <div class="review-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        });
        
        reviewItems.innerHTML = reviewHTML;
        
        // Update totals
        const shippingCost = parseFloat(document.querySelector('input[name="shippingMethod"]:checked')?.value === 'express' ? 12.99 : 5.99);
        const tax = subtotal * 0.08; // Example tax calculation
        
        document.querySelector('.review-totals .subtotal').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.review-totals .shipping').textContent = `$${shippingCost.toFixed(2)}`;
        document.querySelector('.review-totals .tax').textContent = `$${tax.toFixed(2)}`;
        document.querySelector('.review-totals .total').textContent = `$${(subtotal + shippingCost + tax).toFixed(2)}`;
    }
    
    // Shipping method change
    document.querySelectorAll('input[name="shippingMethod"]').forEach(radio => {
        radio.addEventListener('change', function() {
            renderShippingReview();
        });
    });
    
    // Proceed to payment
    document.querySelector('.proceed-to-payment')?.addEventListener('click', function() {
        if (validateShippingForm()) {
            saveShippingInfo();
            navigateToStep(3);
            renderPaymentReview();
        }
    });
    
    // Validate shipping form
    function validateShippingForm() {
        let isValid = true;
        const form = document.getElementById('shippingForm');
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.style.borderColor = 'var(--error)';
                isValid = false;
                
                // Remove error style when user starts typing
                field.addEventListener('input', function() {
                    if (this.value.trim()) {
                        this.style.borderColor = 'var(--border)';
                    }
                }, { once: true });
            }
        });
        
        return isValid;
    }
    
    // Save shipping info
    function saveShippingInfo() {
        const form = document.getElementById('shippingForm');
        shippingInfo = {
            firstName: form.querySelector('#firstName').value,
            lastName: form.querySelector('#lastName').value,
            address: form.querySelector('#address').value,
            city: form.querySelector('#city').value,
            zipCode: form.querySelector('#zipCode').value,
            country: form.querySelector('#country').value,
            phone: form.querySelector('#phone').value,
            shippingMethod: form.querySelector('input[name="shippingMethod"]:checked').value,
            saveAddress: form.querySelector('#saveAddress').checked
        };
        
        localStorage.setItem('shippingInfo', JSON.stringify(shippingInfo));
    }
    
    // Render payment review
    function renderPaymentReview() {
        const summaryItems = document.querySelector('.summary-items');
        const addressDetails = document.querySelector('.address-details');
        let itemsHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
            
            itemsHTML += `
                <div class="summary-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        });
        
        summaryItems.innerHTML = itemsHTML;
        
        // Render shipping address
        if (shippingInfo) {
            addressDetails.innerHTML = `
                <p>${shippingInfo.firstName} ${shippingInfo.lastName}</p>
                <p>${shippingInfo.address}</p>
                <p>${shippingInfo.city}, ${shippingInfo.zipCode}</p>
                <p>${shippingInfo.country}</p>
                <p>${shippingInfo.phone}</p>
            `;
        }
        
        // Update totals
        const shippingCost = shippingInfo?.shippingMethod === 'express' ? 12.99 : 5.99;
        const tax = subtotal * 0.08; // Example tax calculation
        
        document.querySelectorAll('.summary-totals .subtotal').forEach(el => {
            el.textContent = `$${subtotal.toFixed(2)}`;
        });
        
        document.querySelectorAll('.summary-totals .shipping').forEach(el => {
            el.textContent = `$${shippingCost.toFixed(2)}`;
        });
        
        document.querySelectorAll('.summary-totals .tax').forEach(el => {
            el.textContent = `$${tax.toFixed(2)}`;
        });
        
        document.querySelectorAll('.summary-totals .total').forEach(el => {
            el.textContent = `$${(subtotal + shippingCost + tax).toFixed(2)}`;
        });
    }
    
    // Payment tabs
    const paymentTabs = document.querySelectorAll('.payment-tabs .tab-btn');
    paymentTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            paymentTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Place order
    document.querySelector('.place-order')?.addEventListener('click', function() {
        if (validatePaymentForm()) {
            processOrder();
        }
    });
    
    // Validate payment form
    function validatePaymentForm() {
        const activeTab = document.querySelector('.payment-tabs .tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'credit-card') {
            const form = document.getElementById('paymentForm');
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            
            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    field.style.borderColor = 'var(--error)';
                    isValid = false;
                    
                    // Remove error style when user starts typing
                    field.addEventListener('input', function() {
                        if (this.value.trim()) {
                            this.style.borderColor = 'var(--border)';
                        }
                    }, { once: true });
                }
            });
            
            // Validate card number format
            const cardNumber = form.querySelector('#cardNumber');
            if (cardNumber.value.trim() && !/^\d{16}$/.test(cardNumber.value.replace(/\s/g, ''))) {
                cardNumber.style.borderColor = 'var(--error)';
                isValid = false;
            }
            
            // Validate expiry date format
            const expiryDate = form.querySelector('#expiryDate');
            if (expiryDate.value.trim() && !/^\d{2}\/\d{2}$/.test(expiryDate.value)) {
                expiryDate.style.borderColor = 'var(--error)';
                isValid = false;
            }
            
            // Validate CVV format
            const cvv = form.querySelector('#cvv');
            if (cvv.value.trim() && !/^\d{3,4}$/.test(cvv.value)) {
                cvv.style.borderColor = 'var(--error)';
                isValid = false;
            }
            
            return isValid;
        }
        
        return true; // For PayPal/Apple Pay, no form validation needed
    }
    
    // Process order
    function processOrder() {
        const btn = document.querySelector('.place-order');
        btn.disabled = true;
        btn.innerHTML = '<span class="btn-text">Processing...</span>';
        
        // Simulate API call
        setTimeout(() => {
            // In a real app, you would send the order to your backend here
            const orderData = {
                items: cart,
                shipping: shippingInfo,
                payment: getPaymentMethod(),
                total: calculateOrderTotal(),
                orderDate: new Date().toISOString(),
                orderNumber: generateOrderNumber()
            };
            
            // Clear cart
            cart = [];
            localStorage.removeItem('cart');
            
            // Save order to localStorage (in a real app, this would be saved to your database)
            const orders = JSON.parse(localStorage.getItem('orders')) || [];
            orders.push(orderData);
            localStorage.setItem('orders', JSON.stringify(orders));
            
            // Render confirmation
            renderConfirmation(orderData);
            navigateToStep(4);
        }, 2000);
    }
    
    // Get payment method
    function getPaymentMethod() {
        const activeTab = document.querySelector('.payment-tabs .tab-btn.active').getAttribute('data-tab');
        
        if (activeTab === 'credit-card') {
            const form = document.getElementById('paymentForm');
            return {
                method: 'credit_card',
                cardLastFour: form.querySelector('#cardNumber').value.slice(-4),
                cardType: detectCardType(form.querySelector('#cardNumber').value)
            };
        } else if (activeTab === 'paypal') {
            return { method: 'paypal' };
        } else {
            return { method: 'apple_pay' };
        }
    }
    
    // Detect card type
    function detectCardType(cardNumber) {
        cardNumber = cardNumber.replace(/\s/g, '');
        
        if (/^4/.test(cardNumber)) return 'Visa';
        if (/^5[1-5]/.test(cardNumber)) return 'Mastercard';
        if (/^3[47]/.test(cardNumber)) return 'American Express';
        if (/^6(?:011|5)/.test(cardNumber)) return 'Discover';
        
        return 'Credit Card';
    }
    
    // Calculate order total
    function calculateOrderTotal() {
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const shippingCost = shippingInfo?.shippingMethod === 'express' ? 12.99 : 5.99;
        const tax = subtotal * 0.08;
        
        return {
            subtotal: subtotal,
            shipping: shippingCost,
            tax: tax,
            total: subtotal + shippingCost + tax
        };
    }
    
    // Generate order number
    function generateOrderNumber() {
        return `ORD-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;
    }
    
    // Render confirmation
    function renderConfirmation(orderData) {
        document.querySelector('.confirmation-details strong:nth-of-type(1)').textContent = orderData.orderNumber;
        document.querySelector('.confirmation-details strong:nth-of-type(2)').textContent = 
            new Date(orderData.orderDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        document.querySelector('.confirmation-details strong:nth-of-type(3)').textContent = `$${orderData.total.total.toFixed(2)}`;
        
        // Payment method
        let paymentMethod = '';
        if (orderData.payment.method === 'credit_card') {
            paymentMethod = `${orderData.payment.cardType} ending in ${orderData.payment.cardLastFour}`;
        } else if (orderData.payment.method === 'paypal') {
            paymentMethod = 'PayPal';
        } else {
            paymentMethod = 'Apple Pay';
        }
        document.querySelector('.confirmation-details strong:nth-of-type(4)').textContent = paymentMethod;
        
        // Shipping address
        const shippingAddress = document.querySelector('.shipping-address');
        shippingAddress.innerHTML = `
            <p>${orderData.shipping.firstName} ${orderData.shipping.lastName}</p>
            <p>${orderData.shipping.address}</p>
            <p>${orderData.shipping.city}, ${orderData.shipping.zipCode}</p>
            <p>${orderData.shipping.country}</p>
            <p>Phone: ${orderData.shipping.phone}</p>
            <p class="shipping-method">Shipping Method: ${orderData.shipping.shippingMethod === 'express' ? 'Express Shipping' : 'Standard Shipping'}</p>
        `;
        
        // Ordered items
        const orderedItems = document.querySelector('.ordered-items');
        let itemsHTML = '';
        
        orderData.items.forEach(item => {
            itemsHTML += `
                <div class="ordered-item">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-details">
                        <h4>${item.name}</h4>
                        <div class="item-options">
                            <span>Color: ${item.color || 'Black'}</span>
                            <span>Size: ${item.size || 'M'}</span>
                        </div>
                        <div class="item-price">$${item.price.toFixed(2)}</div>
                        <div class="item-quantity">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        });
        
        orderedItems.innerHTML = itemsHTML;
    }
    
    // Navigation buttons
    document.querySelector('.back-to-cart')?.addEventListener('click', function() {
        navigateToStep(1);
    });
    
    document.querySelector('.back-to-shipping')?.addEventListener('click', function() {
        navigateToStep(2);
    });
    
    // Initialize
    renderCartItems();
    
    // If coming back to checkout with items in cart, show cart section
    if (cart.length > 0) {
        navigateToStep(1);
    }
    
    // Phone number formatting
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
    
    // Card number formatting
    const cardNumberInput = document.getElementById('cardNumber');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 16) value = value.substring(0, 16);
            
            let formattedValue = '';
            for (let i = 0; i < value.length; i++) {
                if (i > 0 && i % 4 === 0) formattedValue += ' ';
                formattedValue += value[i];
            }
            
            e.target.value = formattedValue;
        });
    }
    
    // Expiry date formatting
    const expiryDateInput = document.getElementById('expiryDate');
    if (expiryDateInput) {
        expiryDateInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
});