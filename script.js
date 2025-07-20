document.addEventListener('DOMContentLoaded', function() {
    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.menu-btn');
    const navbar = document.querySelector('.navbar');
    menuBtn.addEventListener('click', function() {
        navbar.classList.toggle('active');
        menuBtn.querySelector('i').classList.toggle('fa-times');
    });

    // Dropdown Menu Toggle
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            if (window.innerWidth <= 992) {
                e.preventDefault();
                this.classList.toggle('active');
            }
        });
    });

    // Search Toggle
    const searchBtn = document.querySelector('.search-btn');
    const searchForm = document.querySelector('.search-form');
    searchBtn.addEventListener('click', function() {
        searchForm.classList.toggle('active');
    });

    // Hero Slider
    const slides = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide change every 5 seconds
    setInterval(nextSlide, 5000);

    // Modal Handling
    const accountBtn = document.querySelector('.account-btn');
    const loginModal = document.querySelector('#login-modal');
    const signupModal = document.querySelector('#signup-modal');
    const quickViewModal = document.querySelector('#quick-view-modal');
    const closeModals = document.querySelectorAll('.close-modal');
    const switchToSignup = document.querySelector('.switch-to-signup');
    const switchToLogin = document.querySelector('.switch-to-login');
    const quickViewBtns = document.querySelectorAll('.quick-view');

    accountBtn.addEventListener('click', function() {
        loginModal.classList.add('active');
    });

    closeModals.forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });

    switchToSignup.addEventListener('click', function(e) {
        e.preventDefault();
        loginModal.classList.remove('active');
        signupModal.classList.add('active');
    });

    switchToLogin.addEventListener('click', function(e) {
        e.preventDefault();
        signupModal.classList.remove('active');
        loginModal.classList.add('active');
    });

    // Quick View Modal
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent;
            const productImage = productCard.querySelector('img').src;
            
            const quickViewContent = `
                <div class="product-images">
                    <div class="main-image">
                        <img src="${productImage}" alt="${productTitle}">
                    </div>
                    <div class="thumbnail-images">
                        <img src="${productImage}" alt="Thumbnail 1">
                        <img src="${productImage}" alt="Thumbnail 2">
                        <img src="${productImage}" alt="Thumbnail 3">
                    </div>
                </div>
                <div class="product-info">
                    <h2>${productTitle}</h2>
                    <div class="price">${productPrice}</div>
                    <div class="rating">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star-half-alt"></i>
                        <span>(24 reviews)</span>
                    </div>
                    <p class="description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                    <div class="size-selector">
                        <label>Size:</label>
                        <div class="sizes">
                            <button>S</button>
                            <button>M</button>
                            <button class="selected">L</button>
                            <button>XL</button>
                            <button>XXL</button>
                        </div>
                    </div>
                    <div class="color-selector">
                        <label>Color:</label>
                        <div class="colors">
                            <button style="background-color: #000000;"></button>
                            <button style="background-color: #808080;"></button>
                            <button style="background-color: #964B00;" class="selected"></button>
                        </div>
                    </div>
                    <div class="quantity-selector">
                        <label>Quantity:</label>
                        <div class="quantity">
                            <button class="decrease">-</button>
                            <input type="number" value="1" min="1">
                            <button class="increase">+</button>
                        </div>
                    </div>
                    <button class="btn add-to-cart">Add to Cart</button>
                </div>
            `;
            
            quickViewModal.querySelector('.quick-view-content').innerHTML = quickViewContent;
            quickViewModal.classList.add('active');
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
        }
    });

    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    const cartCount = document.querySelector('.cart-count');
    let count = 0;

    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            count++;
            cartCount.textContent = count;
            
            // Animation effect
            const cartIcon = document.querySelector('.cart-btn i');
            cartIcon.classList.add('animate');
            setTimeout(() => {
                cartIcon.classList.remove('animate');
            }, 500);
            
            // Notification
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.innerHTML = `
                <i class="fas fa-check-circle"></i>
                <span>Item added to cart!</span>
            `;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        });
    });

    // Product Card Hover Effect
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', `${x}px`);
            this.style.setProperty('--mouse-y', `${y}px`);
        });
    });
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// User Authentication Functions
function signUp(email, password, name) {
  auth.createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add user to Firestore
      db.collection("users").doc(userCredential.user.uid).set({
        name: name,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      });
    })
    .catch((error) => {
      console.error("Signup error:", error);
    });
}

function login(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .catch((error) => {
      console.error("Login error:", error);
    });
}

// Cart Functions
function addToCart(productId, quantity) {
  const userId = auth.currentUser?.uid;
  if (userId) {
    db.collection("carts").doc(userId).collection("items").doc(productId).set({
      productId: productId,
      quantity: firebase.firestore.FieldValue.increment(quantity || 1),
      updatedAt: firebase.firestore.FieldValue.serverTimestamp()
    }, { merge: true });
  }
}

function getCart() {
  const userId = auth.currentUser?.uid;
  if (userId) {
    return db.collection("carts").doc(userId).collection("items").get();
  }
  return Promise.resolve(null);
}