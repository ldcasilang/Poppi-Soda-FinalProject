document.addEventListener("DOMContentLoaded", function () {
    let checkoutItems = JSON.parse(localStorage.getItem("checkoutItems")) || [];
    let orderTableBody = document.querySelector(".cart_table tbody");
    let subtotalContainer = document.getElementById("cart-subtotal");
    let totalContainer = document.getElementById("checkout-total");

    let subtotal = 0;
    orderTableBody.innerHTML = ""; // Clear table

    checkoutItems.forEach(item => {
        let total = item.price * item.quantity;
        subtotal += total;

        let row = document.createElement("tr");
        row.innerHTML = `
            <td><img src="${item.image}" width="50"></td>
            <td>${item.name}</td>
            <td>₱${item.price.toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₱${total.toFixed(2)}</td>
        `;
        orderTableBody.appendChild(row);
    });

    // Update totals
    subtotalContainer.textContent = subtotal.toFixed(2);
    totalContainer.textContent = `₱${subtotal.toFixed(2)}`;
});
