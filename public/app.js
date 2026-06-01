// Global state
let currentUser = null;
let cart = [];
const API_BASE_URL = '/api';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    checkUserLogin();
});

// Section Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById(sectionId).classList.add('active');
}

function showHome() { showSection('home'); }
function showShop() { showSection('shop'); loadProducts(); }
function showCart() { showSection('cart'); displayCart(); }
function showAccount() { showSection('account'); }

// Load Products
async function loadProducts() {
    try {
        const response = await fetch(`${API_BASE_URL}/products`);
        const products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

// Display Products
function displayProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    
    if (products.length === 0) {
        grid.innerHTML = '<p>No products found</p>';
        return;
    }
    
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-image">📦</div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category || 'General'}</div>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-rating">${'⭐'.repeat(Math.round(product.rating))}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
                <button class="add-to-cart-btn" 
                        onclick="addToCart('${product._id}', '${product.name}', ${product.price})"
                        ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        `;
        grid.appendChild(card);
    });
}

// Search Products
function searchProducts() {
    const searchInput = document.getElementById('search-input').value;
    const categoryFilter = document.getElementById('category-filter').value;
    
    let url = `${API_BASE_URL}/products?`;
    if (searchInput) url += `search=${searchInput}&`;
    if (categoryFilter) url += `category=${categoryFilter}&`;
    
    fetch(url)
        .then(res => res.json())
        .then(products => displayProducts(products))
        .catch(error => console.error('Error searching products:', error));
}

function filterByCategory() {
    searchProducts();
}

// Cart Management
function addToCart(productId, productName, price) {
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId,
            productName,
            price,
            quantity: 1
        });
    }
    
    updateCartCount();
    alert(`${productName} added to cart!`);
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function displayCart() {
    const cartItemsDiv = document.getElementById('cart-items');
    const cartTotalDiv = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsDiv.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
        cartTotalDiv.textContent = '0.00';
        return;
    }
    
    let html = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.productName}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                </div>
                <div class="cart-item-quantity">
                    <input type="number" value="${item.quantity}" min="1" 
                           onchange="updateQuantity(${index}, this.value)">
                    <span>$${itemTotal.toFixed(2)}</span>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${index})">Remove</button>
            </div>
        `;
    });
    
    cartItemsDiv.innerHTML = html;
    cartTotalDiv.textContent = total.toFixed(2);
}

function updateQuantity(index, newQuantity) {
    const quantity = parseInt(newQuantity);
    if (quantity > 0) {
        cart[index].quantity = quantity;
        displayCart();
        updateCartCount();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    displayCart();
    updateCartCount();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        displayCart();
        updateCartCount();
    }
}

// Checkout
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    if (!currentUser) {
        alert('Please login first');
        showAccount();
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingAddress = prompt('Enter your shipping address:');
    
    if (!shippingAddress) return;
    
    const orderData = {
        userId: currentUser.id,
        items: cart,
        totalAmount: total,
        shippingAddress
    };
    
    fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
    })
    .then(res => res.json())
    .then(order => {
        alert(`Order placed successfully! Order ID: ${order._id}`);
        cart = [];
        displayCart();
        updateCartCount();
        loadUserOrders();
    })
    .catch(error => {
        alert('Error placing order');
        console.error(error);
    });
}

// Authentication
function toggleRegister() {
    const nameInput = document.getElementById('name');
    nameInput.style.display = nameInput.style.display === 'none' ? 'block' : 'none';
}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const name = document.getElementById('name').value;
    
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }
    
    const isRegister = document.getElementById('name').style.display !== 'none';
    const endpoint = isRegister ? '/register' : '/login';
    const body = isRegister 
        ? { name, email, password }
        : { email, password };
    
    try {
        const response = await fetch(`${API_BASE_URL}/users${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            alert(data.error || 'Authentication failed');
            return;
        }
        
        currentUser = data.user;
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        showUserProfile();
    } catch (error) {
        alert('Error: ' + error.message);
    }
}

function checkUserLogin() {
    const user = localStorage.getItem('user');
    if (user) {
        currentUser = JSON.parse(user);
        showUserProfile();
    }
}

function showUserProfile() {
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('user-profile').style.display = 'block';
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
    loadUserOrders();
}

function loadUserOrders() {
    if (!currentUser) return;
    
    fetch(`${API_BASE_URL}/orders/user/${currentUser.id}`)
        .then(res => res.json())
        .then(orders => {
            const historyDiv = document.getElementById('order-history');
            
            if (orders.length === 0) {
                historyDiv.innerHTML = '<p>No orders yet</p>';
                return;
            }
            
            let html = '';
            orders.forEach(order => {
                html += `
                    <div class="order-item">
                        <div class="order-id">Order #${order._id}</div>
                        <div>Total: $${order.totalAmount.toFixed(2)}</div>
                        <div>Items: ${order.items.length}</div>
                        <span class="order-status ${order.status}">${order.status}</span>
                    </div>
                `;
            });
            historyDiv.innerHTML = html;
        })
        .catch(error => console.error('Error loading orders:', error));
}

function logout() {
    currentUser = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    document.getElementById('user-profile').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
    document.getElementById('name').style.display = 'none';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    showHome();
}
