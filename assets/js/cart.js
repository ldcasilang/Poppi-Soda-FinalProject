document.addEventListener("DOMContentLoaded", function () {
    let cart = JSON.parse(localStorage.getItem("cart")) || []; // Retrieve stored cart
    updateCartUI(); // Load stored cart items on page load
    updateCartBadge(); // Update badge based on cart items
  
    // Select the user email element and check if it's still "Loading..." or "Not Signed In"
    const userEmailElement = document.getElementById("user-email");
  
    // Select all the cart buttons
    document.querySelectorAll(".fa-cart-plus").forEach((button) => {
      button.addEventListener("click", function (event) {
        event.preventDefault(); // Prevent default action of the button click
  
        // Check if the user is logged in by examining the user-email text content
        const isLoggedIn = userEmailElement.textContent !== "Loading..." && userEmailElement.textContent !== "Not Signed In";
  
        if (!isLoggedIn) {
          alert('Please log in first to add items to your cart!');
          // Optionally, redirect the user to a login page
          // window.location.href = '/login';
        } else {
          let productElement = this.closest(".th-product"); // Find closest product
          let productName = productElement.querySelector(".product-title a").textContent;
          let productImage = productElement.querySelector(".product-img img").src;
          let productPrice = parseFloat(productElement.querySelector(".price").textContent.replace("₱", "").trim());
  
          // Check if the product is already in the cart
          let existingItem = cart.find(item => item.name === productName);
          if (existingItem) {
            existingItem.quantity++; // Increase quantity if exists
          } else {
            cart.push({
              name: productName,
              image: productImage,
              price: productPrice,
              quantity: 1
            });
          }
  
          localStorage.setItem("cart", JSON.stringify(cart)); // Save cart
          updateCartUI(); // Update UI
          updateCartBadge(); // Update badge immediately
          alert('Item added to cart!');
        }
      });
    });
  
    // Function to update the cart UI
    function updateCartUI() {
      let cartContainer = document.querySelector(".woocommerce-mini-cart");
      let subtotalContainer = document.querySelector(".woocommerce-mini-cart__total .woocommerce-Price-amount");
      cartContainer.innerHTML = ""; // Clear existing items
  
      let subtotal = 0;
      cart.forEach((item, index) => {
        subtotal += item.price * item.quantity;
        let cartItem = document.createElement("li");
        cartItem.classList.add("woocommerce-mini-cart-item", "mini_cart_item");
        cartItem.innerHTML = `
          <a href="#" class="remove remove_from_cart_button" data-index="${index}">
              <i class="far fa-times"></i>
          </a>
          <a href="#">
              <img src="${item.image}" alt="Cart Image" />
              ${item.name}
          </a>
          <span class="quantity">${item.quantity} × 
              <span class="woocommerce-Price-amount amount">
                  <span class="woocommerce-Price-currencySymbol">₱</span>${item.price.toFixed(2)}
              </span>
          </span>
        `;
        cartContainer.appendChild(cartItem);
      });
  
      subtotalContainer.innerHTML = `<span class="woocommerce-Price-currencySymbol">₱</span>${subtotal.toFixed(2)}`;
  
      // Add event listener for removing items
      document.querySelectorAll(".remove_from_cart_button").forEach(button => {
        button.addEventListener("click", function (event) {
          event.preventDefault();
          let index = this.getAttribute("data-index");
  
          // Remove the item from the cart
          cart.splice(index, 1);
          localStorage.setItem("cart", JSON.stringify(cart)); // Update storage
          updateCartUI(); // Update cart UI
          updateCartBadge(); // Update badge immediately
        });
      });
    }
  
    // Function to update the cart badge based on the number of items in the cart shown in the side menu
    function updateCartBadge() {
      const badgeElement = document.querySelector(".sideMenuToggler .badge");
  
      // Get the number of items in the cart by counting items in the side menu cart
      const cartItemsInMenu = cart.reduce((total, item) => total + item.quantity, 0);
      
      // Update the badge text
      badgeElement.textContent = cartItemsInMenu;
    }
  });
  
