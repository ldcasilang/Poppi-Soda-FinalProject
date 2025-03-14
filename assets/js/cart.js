document.addEventListener("DOMContentLoaded", function () {
  let cartTableBody = document.querySelector(".tinvwl-table-manage-list tbody");
  let totalPriceEl = document.getElementById("total-price");
  let checkoutBtn = document.getElementById("proceed-to-checkout");
  let selectAllCheckbox = document.getElementById("select-all");

  if (!cartTableBody || !totalPriceEl || !checkoutBtn || !selectAllCheckbox) return;

  let user = firebase.auth().currentUser;
  if (!user) {
      cartTableBody.innerHTML = `<tr><td colspan="8" class="text-center">You are not logged in. <a href="login.html">Login</a> to view your cart.</td></tr>`;
      return;
  }

  let cartRef = firebase.database().ref("cart/" + user.uid);
  cartRef.on("value", function (snapshot) {
      cartTableBody.innerHTML = "";
      let total = 0;

      snapshot.forEach((childSnapshot) => {
          let productObj = {
              key: childSnapshot.key,
              val: childSnapshot.val()
          };

          let row = document.createElement("tr");

          // Checkbox
          let checkboxCell = document.createElement("td");
          let checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          checkbox.classList.add("cart-checkbox");
          checkboxCell.appendChild(checkbox);
          row.appendChild(checkboxCell);

          // Remove Button
          let removeCell = document.createElement("td");
          let removeBtn = document.createElement("button");
          removeBtn.classList.add("btn", "btn-danger");
          removeBtn.innerText = "X";
          removeBtn.onclick = function () {
              firebase.database().ref("cart/" + user.uid + "/" + productObj.key).remove();
          };
          removeCell.appendChild(removeBtn);
          row.appendChild(removeCell);

          // Product Image
          let imageCell = document.createElement("td");
          let img = document.createElement("img");
          img.src = productObj.val.photo;
          img.style.width = "50px";
          img.style.height = "50px";
          imageCell.appendChild(img);
          row.appendChild(imageCell);

          // Product Name
          let nameCell = document.createElement("td");
          nameCell.innerText = productObj.val.title;
          row.appendChild(nameCell);

          // Unit Price
          let priceCell = document.createElement("td");
          priceCell.innerText = `₱${productObj.val.price}`;
          row.appendChild(priceCell);

          // Quantity
          let quantityCell = document.createElement("td");
          let quantityInput = document.createElement("input");
          quantityInput.type = "number";
          quantityInput.value = productObj.val.quantity;
          quantityInput.min = "1";
          quantityInput.style.width = "50px";
          quantityInput.onchange = function () {
              firebase.database().ref("cart/" + user.uid + "/" + productObj.key + "/quantity").set(quantityInput.value);
          };
          quantityCell.appendChild(quantityInput);
          row.appendChild(quantityCell);

          // Stock Status
          let stockCell = document.createElement("td");
          stockCell.innerText = productObj.val.stock > 0 ? "In Stock" : "Out of Stock";
          row.appendChild(stockCell);

          // Total Price
          let totalCell = document.createElement("td");
          let itemTotal = productObj.val.price * productObj.val.quantity;
          total += itemTotal;
          totalCell.innerText = `₱${itemTotal}`;
          row.appendChild(totalCell);

          cartTableBody.appendChild(row);
      });

      totalPriceEl.innerText = `₱${total}`;
  });

  // Select All Checkbox
  selectAllCheckbox.addEventListener("change", function () {
      let allCheckboxes = document.querySelectorAll(".cart-checkbox");
      allCheckboxes.forEach(checkbox => checkbox.checked = selectAllCheckbox.checked);
  });

  // Checkout Button
  checkoutBtn.addEventListener("click", function () {
      alert("Proceeding to checkout...");
      // Redirect or perform checkout logic
  });
});
