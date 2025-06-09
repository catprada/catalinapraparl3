// Funcionalidad del carrusel
document.addEventListener('DOMContentLoaded', function() {
    // Variables para el carrusel
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carrusel img');
    const totalSlides = slides.length;

    // Función para mostrar una slide específica
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });
    }

    // Función para avanzar al siguiente slide
    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    // Función para retroceder al slide anterior
    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    // Agregar botones de navegación al carrusel
    const carruselContainer = document.querySelector('.carrusel-container');
    const prevButton = document.createElement('button');
    const nextButton = document.createElement('button');

    prevButton.innerHTML = '&#10094;';
    nextButton.innerHTML = '&#10095;';
    prevButton.className = 'carrusel-btn prev';
    nextButton.className = 'carrusel-btn next';

    carruselContainer.appendChild(prevButton);
    carruselContainer.appendChild(nextButton);

    // Event listeners para los botones
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);

    // Auto-play del carrusel
    let slideInterval = setInterval(nextSlide, 5000);

    // Pausar el auto-play cuando el mouse está sobre el carrusel
    carruselContainer.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });

    // Reanudar el auto-play cuando el mouse sale del carrusel
    carruselContainer.addEventListener('mouseleave', () => {
        slideInterval = setInterval(nextSlide, 5000);
    });

    // Funcionalidad para los botones "Ver más" en las tarjetas de productos
    const verMasButtons = document.querySelectorAll('.btn-primary');
    verMasButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cardTitle = this.closest('.card').querySelector('.card-title').textContent;
            alert(`Próximamente: Más información sobre ${cardTitle}`);
        });
    });

    // Funcionalidad para el menú móvil
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');

    if (navbarToggler && navbarCollapse) {
        navbarToggler.addEventListener('click', () => {
            navbarCollapse.classList.toggle('show');
        });

        // Cerrar el menú al hacer clic en un enlace
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    navbarCollapse.classList.remove('show');
                }
            });
        });
    }
});

// Funcionalidad del carrito
document.addEventListener('DOMContentLoaded', function() {
    // Inicialización del carrito
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let cartCount = document.querySelector('.cart-count');
    let cartItems = document.querySelector('.cart-items');
    let totalAmount = document.querySelector('.total-amount');
    let cartContainer = document.querySelector('.cart-container');
    let cartIcon = document.querySelector('.cart-icon');
    let closeCart = document.querySelector('.close-cart');
    let checkoutBtn = document.querySelector('.checkout-btn');

    // Guardar carrito en localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Actualizar el carrito
    function updateCart() {
        // Actualizar contador
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Actualizar lista de items
        cartItems.innerHTML = '';
        
        if (cart.length === 0) {
            cartItems.innerHTML = `
                <div class="empty-cart-message">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Tu carrito está vacío</p>
                </div>
            `;
        } else {
            cart.forEach(item => {
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-details">
                        <div class="cart-item-name">${item.name}</div>
                        <div class="cart-item-price">$${item.price}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn minus" data-id="${item.id}">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn plus" data-id="${item.id}">+</button>
                        </div>
                    </div>
                    <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;
                cartItems.appendChild(cartItem);
            });
        }

        // Actualizar total
        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        totalAmount.textContent = `$${total.toFixed(2)}`;
    }

    // Manejar controles de cantidad en productos
    document.querySelectorAll('.quantity-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const quantitySpan = e.target.parentElement.querySelector('.quantity');
            let quantity = parseInt(quantitySpan.textContent);

            if (e.target.classList.contains('plus')) {
                quantity++;
            } else if (e.target.classList.contains('minus') && quantity > 1) {
                quantity--;
            }

            quantitySpan.textContent = quantity;
        });
    });

    // Agregar al carrito
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = e.target.dataset.id;
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);
            const quantity = parseInt(e.target.parentElement.querySelector('.quantity').textContent);

            // Verificar si el producto ya está en el carrito
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: quantity
                });
            }

            // Guardar y actualizar
            saveCart();
            updateCart();
            
            // Mostrar mensaje de confirmación
            const message = document.createElement('div');
            message.className = 'add-to-cart-message';
            message.textContent = `¡${quantity} ${quantity === 1 ? 'producto' : 'productos'} agregado${quantity === 1 ? '' : 's'} al carrito!`;
            document.body.appendChild(message);
            
            // Remover mensaje después de 2 segundos
            setTimeout(() => {
                message.remove();
            }, 2000);

            // Abrir carrito
            cartContainer.classList.add('active');
        });
    });

    // Manejar controles de cantidad en el carrito
    cartItems.addEventListener('click', (e) => {
        if (e.target.classList.contains('quantity-btn')) {
            const productId = e.target.dataset.id;
            const item = cart.find(item => item.id === productId);
            const quantitySpan = e.target.parentElement.querySelector('.quantity');
            
            if (e.target.classList.contains('plus')) {
                item.quantity++;
            } else if (e.target.classList.contains('minus') && item.quantity > 1) {
                item.quantity--;
            }
            
            quantitySpan.textContent = item.quantity;
            saveCart();
            updateCart();
        }
    });

    // Eliminar del carrito
    cartItems.addEventListener('click', (e) => {
        if (e.target.closest('.remove-item')) {
            const productId = e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== productId);
            saveCart();
            updateCart();
        }
    });

    // Abrir/Cerrar carrito
    cartIcon.addEventListener('click', () => {
        cartContainer.classList.add('active');
    });

    closeCart.addEventListener('click', () => {
        cartContainer.classList.remove('active');
    });

    // Checkout
    checkoutBtn.addEventListener('click', () => {
        if (cart.length > 0) {
            alert('¡Gracias por tu compra!');
            cart = [];
            saveCart();
            updateCart();
            cartContainer.classList.remove('active');
        } else {
            alert('Tu carrito está vacío');
        }
    });

    // Inicializar carrito
    updateCart();
}); 