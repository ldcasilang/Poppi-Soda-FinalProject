import { db, auth } from "./firebase-config.js";
import { collection, addDoc, query, where, getDocs, setDoc, doc } 
from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

// Place Order
async function placeOrder() {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to place an order.");
        return;
    }

    const userCartRef = doc(db, "carts", user.uid);
    const cartSnap = await getDoc(userCartRef);
    if (!cartSnap.exists() || cartSnap.data().items.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const orderRef = collection(db, "orders");
    await addDoc(orderRef, {
        userId: user.uid,
        items: cartSnap.data().items,
        timestamp: new Date()
    });

    await setDoc(userCartRef, { items: [] }); // Clear cart after checkout
    alert("Order placed successfully!");
}

// Get user orders
async function getUserOrders() {
    const user = auth.currentUser;
    if (!user) return [];

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("userId", "==", user.uid));
    const querySnapshot = await getDocs(q);

    let orders = [];
    querySnapshot.forEach((doc) => {
        orders.push(doc.data());
    });

    return orders;
}

export { placeOrder, getUserOrders };
