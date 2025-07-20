document.addEventListener('DOMContentLoaded', function() {
    // This would normally come from your backend API
    const products = {
        men: [
            {
                id: 1,
                name: "Premium Denim Jacket",
                price: 89.99,
                category: "jackets",
                image: "images/products/men/denim-jacket.jpg",
                rating: 4.5
            },
            // Add more products
        ],
        women: [
            // Women's products
        ],
        kids: [
            // Kids' products
        ]
    };

    const category = window.location.pathname.split('/').pop().replace('.html', '');
    const productGrid = document.querySelector('.product-grid');
    const sortSelect = document.querySelector('#sort-by');
    const filterSelect = document.querySelector('#filter-category');
    const priceSlider = document.querySelector('#price-slider');
    const priceValue = document.querySelector('#price-value');

    // Load products based on category
    function loadProducts() {
        let filteredProducts = products[category] || [];
        const maxPrice = parseInt(priceSlider.value);
        const filterCategory = filterSelect.value;
        
        // Filter by category
        if (filterCategory !== 'all') {
            filteredProducts = filteredProducts.filter(
                product => product.category === filterCategory
            );
        }
        
        // Filter by price
        filteredProducts = filteredProducts.filter(
            product => product.price <= maxPrice
        );
        
        // Sort products
        switch(sortSelect.value) {
            case 'newest':
                filteredProducts.sort((a, b) => b.id - a.id);
                break;
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            default: // popular
                filteredProducts.sort((a, b) => b.rating - a.rating);
        }
        
        // Display products
        productGrid.innerHTML = '';
        filteredProducts.forEach(product => {
            productGrid.innerHTML += `
                <div class="product-card">
                    <div class="product-thumb">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="product-actions">
                            <button class="quick-view"><i class="far fa-eye"></i></button>
                            <button class="add-to-wishlist"><i class="far fa-heart"></i></button>
                        </div>
                    </div>
                    <div class="product-details">
                        <h3 class="product-title">${product.name}</h3>
                        <div class="product-price">$${product.price.toFixed(2)}</div>
                        <div class="product-rating">
                            ${renderRating(product.rating)}
                            <span>(${Math.floor(Math.random() * 50) + 1})</span>
                        </div>
                        <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
                    </div>
                </div>
            `;
        });
        
        // Reattach event listeners
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products[category].find(p => p.id === productId);
                addToCart(product);
            });
        });
    }
    
    function renderRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    }
    
    function updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        document.querySelector('.cart-count').textContent = totalItems;
    }
    
    // Event listeners
    sortSelect.addEventListener('change', loadProducts);
    filterSelect.addEventListener('change', loadProducts);
    priceSlider.addEventListener('input', function() {
        priceValue.textContent = `Up to $${this.value}`;
        loadProducts();
    });
    
    // Initialize
    updateCartCount();
    loadProducts();
});