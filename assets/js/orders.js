document.addEventListener("DOMContentLoaded", function () {
    let orderDetails = JSON.parse(localStorage.getItem("orderDetails")) || { cart: [] };

    if (!orderDetails.cart.length) {
        console.log("No order details found.");
        return;
    }

    let orderTableBody = document.getElementById("order-table-body");

    orderDetails.cart.forEach((item, index) => {
        let row = document.createElement("tr");
        let total = item.price * item.quantity;
        let isReceived = item.received || false; // Check if item is already marked as received

        row.innerHTML = `
            <td>#${index + 1}</td>
            <td><img src="${item.image}" alt="Product Image" width="50"></td>
            <td>${item.name}</td>
            <td>₱${Number(item.price).toFixed(2)}</td>
            <td>${item.quantity}</td>
            <td>₱${total.toFixed(2)}</td>
            <td>${orderDetails.paymentMethod}</td>
            <td>
                <label style="display: flex; align-items: center; gap: 5px; cursor: pointer;">
                    <input type="checkbox" name="orderReceived" data-index="${index}" ${isReceived ? "checked" : ""}>
                    <span>Order Received</span>
                </label>
            </td>
        `;

        orderTableBody.appendChild(row);
    });

    // Add event listener for checkboxes to update localStorage
    document.querySelectorAll('input[name="orderReceived"]').forEach(checkbox => {
        checkbox.addEventListener("change", function () {
            let idx = this.getAttribute("data-index");
            orderDetails.cart[idx].received = this.checked; // Update the status
            localStorage.setItem("orderDetails", JSON.stringify(orderDetails)); // Save back to localStorage
        });
    });
});
