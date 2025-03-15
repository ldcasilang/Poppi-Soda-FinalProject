document.addEventListener("DOMContentLoaded", function () {
    let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    let orderTableBody = document.querySelector(".cart_table tbody");
    let subtotalContainer = document.getElementById("cart-subtotal");
    let totalContainer = document.getElementById("checkout-total");
    
    let subtotal = checkoutItems.reduce((sum, item) => {
        let total = item.price * item.quantity;
        let row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" width="50"></td>
            <td>${item.name}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₱${total.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
        return sum + total;
    }, 0);
    
    subtotalContainer.textContent = subtotal.toFixed(2);
    totalContainer.textContent = `₱${subtotal.toFixed(2)}`;
    
    function updateShipping() {
        let shippingType = document.getElementById("shipping-type");
        let shippingPriceEl = document.getElementById("shipping-price");
        let selectedCountry = document.querySelector("#ship-to-different-address-checkbox").checked
            ? document.querySelector(".shipping_address .form-select").value
            : document.querySelector(".woocommerce-checkout .col-lg-6 .form-select").value;
        
        let shippingPrice = selectedCountry === "Philippines (PH)" ? 39 : 89;
        shippingType.textContent = selectedCountry === "Philippines (PH)" ? "Local Shipping" : "International Shipping";
        shippingPriceEl.textContent = shippingPrice.toFixed(2);
        totalContainer.textContent = `₱${(subtotal + shippingPrice).toFixed(2)}`;
    }
    
    document.querySelectorAll(".woocommerce-checkout .col-lg-6 .form-select, .shipping_address .form-select, #ship-to-different-address-checkbox").forEach(el => {
        el.addEventListener("change", updateShipping);
    });
    updateShipping();

    function saveFormData() {
        document.querySelectorAll(".woocommerce-checkout input, .woocommerce-checkout select, .woocommerce-checkout textarea").forEach(input => {
            if (input.name) localStorage.setItem(input.name, input.value);
        });
    }
    
    function loadFormData() {
        document.querySelectorAll(".woocommerce-checkout input, .woocommerce-checkout select, .woocommerce-checkout textarea").forEach(input => {
            if (input.name && localStorage.getItem(input.name)) input.value = localStorage.getItem(input.name);
        });
    }
    
    loadFormData();
    document.querySelector(".woocommerce-checkout").addEventListener("input", saveFormData);
    document.querySelector(".woocommerce-checkout").addEventListener("submit", () => localStorage.clear());

    document.getElementById("confirm-checkout-btn").addEventListener("click", function () {
        let fullAddress = [
            document.querySelector(".woocommerce-checkout input[placeholder='Street Address']").value,
            document.querySelector(".woocommerce-checkout input[placeholder='Town / City']").value,
            document.querySelector(".woocommerce-checkout input[placeholder='Postcode / Zip']").value
        ].filter(Boolean).join(", ");
        
        let codText = document.querySelector(".payment_box.payment_method_cod p");
        if (fullAddress) codText.textContent = `Delivery Address: ${fullAddress}`;
    });

    document.querySelector(".th-btn[type='submit']").addEventListener("click", function (event) {
        event.preventDefault();
        document.querySelectorAll(".woocommerce-checkout input, .woocommerce-checkout textarea").forEach(input => {
            if (input.type === "checkbox" || input.type === "radio") {
                input.checked = input.defaultChecked;
            } else {
                input.value = "";
            }
        });
        document.getElementById("payment_method_cod").checked = true;
        document.querySelector(".order-summary-table").innerHTML = "<tr><td colspan='4'>Your cart is empty.</td></tr>";
        setTimeout(() => window.location.href = "orders.html", 1000);
    });

    document.getElementById("place-order-btn").addEventListener("click", function() {
        let billingData = {};
        document.querySelectorAll(".woocommerce-checkout [name^='billing_']").forEach(input => {
            billingData[input.name] = input.value;
        });

        let orderDetails = {
            billingData,
            paymentMethod: document.querySelector("input[name='payment_method']:checked").value,
            cart: checkoutItems
        };

        localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
        window.location.href = "orders.html";
    });
});

localStorage.setItem('orderDetails', JSON.stringify(orderDetails));
