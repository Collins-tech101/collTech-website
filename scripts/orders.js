import { orders } from "../data/orders.js";
import { formatCurrency } from "./utils/money.js";
import { addToCart, calculateCartQuantity } from "../data/cart.js";
import { handleSearch } from "./utils/search.js";

export function renderOrdersPage() {
  const ordersGrid = document.querySelector('.js-orders-grid');
//console.log(ordersGrid);

orders.forEach(order => {
  let productsHTML = '';
  order.products.forEach(product => {
    productsHTML += `
      <div class="product-image-container">
        <img src="${product.image}">
      </div>
      <div class="product-details">
        <div class="product-name">${product.name}</div>
        <div class="product-delivery-date">Arriving on: ${product.deliveryDate}</div>
        <div class="product-quantity">Quantity: ${product.quantity}</div>
        <button class="buy-again-button button-primary js-buy-again-button" data-product-id="${product.productId}">
          <img class="buy-again-icon" src="images/icons/buy-again.png">
          <span class="buy-again-message">Buy it again</span>
        </button>
      </div>
      <div class="product-actions">
        <a href="tracking.html?orderId=${order.id}&productId=${product.productId}">
          <button class="track-package-button button-secondary js-track-package-button">Track package</button>
        </a>
      </div>
    `;
  });

  const orderHTML = `
    <div class="order-container">
      <div class="order-header">
        <div class="order-header-left-section">
          <div class="order-date">
            <div class="order-header-label">Order Placed:</div>
            <div>${new Date(order.orderTime).toLocaleDateString('en-US', {month: 'long', day: 'numeric'})}</div>
          </div>
          <div class="order-total">
            <div class="order-header-label">Total:</div>
            <div>$${formatCurrency(order.totalCostCents)}</div>
          </div>
        </div>
        <div class="order-header-right-section">
          <div class="order-header-label">Order ID:</div>
          <div>${order.id}</div>
        </div>
      </div>
      <div class="order-details-grid">
        ${productsHTML}
      </div>
    </div>
  `;
  ordersGrid.innerHTML += orderHTML;
});

document.querySelectorAll('.js-buy-again-button').forEach(button => {
  button.dataset.originalText = button.innerHTML;
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    button.innerHTML = '<img class="buy-again-icon" src="images/icons/checkmark.png"> Added';
    addToCart(productId, 1);
    document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();
    setTimeout(() => {
      button.innerHTML = button.dataset.originalText;
    }, 2000);
  })
});

document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

document.querySelectorAll('.js-track-package-button').forEach((button) => {
  button.addEventListener('click', () => {
    const orderId = button.dataset.orderId;
    const productId = button.dataset.productId;
    window.location.href = `tracking.html?orderId=${orderId}&productId=${productId}`;
  });
});

handleSearch();
}

renderOrdersPage();