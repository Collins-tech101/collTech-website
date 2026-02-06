import { orders } from '../data/orders.js';
import { getProduct } from '../data/products.js';
import { calculateCartQuantity } from '../data/cart.js';
import { handleSearch } from './utils/search.js';

const urlParams = new URLSearchParams(window.location.search);
const orderId = urlParams.get('orderId');
const productId = urlParams.get('productId');

function renderTrackingPage() {
  const orderTracking = document.querySelector('.js-order-tracking')
  const order = orders.find(o => o.id === orderId);
  if (!order) {
    orderTracking.innerHTML = `<p>Order not found.</p>`;
    return;
  }

  const productInOrder = order.products.find(p => p.productId === productId);
  if (!productInOrder) {
    document.body.innerHTML = `<p>Product not found in this order.</p>`;
    return;
  }

  const product = getProduct(productId);
  const orderTime = new Date(order.orderTime);
  const deliveryTime = new Date(productInOrder.deliveryDate + ', ' + new Date().getFullYear());
  const deliveryDate = deliveryTime.toLocaleDateString('en-US', {weekday: 'long', month: 'long', day: 'numeric'})

  const trackingHTML = `
   <a class="back-to-orders-link link-primary" href="orders.html">
  View all orders
</a>

<div class="delivery-date">
  Arriving on ${deliveryDate}
</div>

<div class="product-info">
  ${product.name}
</div>

<div class="product-info">
  Quantity: ${productInOrder.quantity}
</div>

<img class="product-image" src="${product.image}">

<div class="progress-labels-container">
  <div class="progress-label">
    Preparing
  </div>
  <div class="progress-label current-status">
    Shipped
  </div>
  <div class="progress-label">
    Delivered
  </div>
</div>

<div class="progress-bar-container">
  <div class="progress-bar js-progress-bar"></div>
</div> 
  `;

  orderTracking.innerHTML = trackingHTML;

  document.querySelector('.js-cart-quantity').innerHTML = calculateCartQuantity();

  function updateProgress(orderTime, deliveryTime) {
    const currentTime = new Date();
    let progress = ((currentTime - orderTime) / (deliveryTime - orderTime)) * 100;
    progress = Math.max(0, Math.min(progress, 100)); // Clamp between 0 and 100

    const progressBar = document.querySelector('.js-progress-bar');
    progressBar.style.width = progress + '%';

    const progressLabels = document.querySelectorAll('.progress-label');
    progressLabels.forEach(label => label.classList.remove('current-status'));

    if (progress < 50) {
        progressLabels[0].classList.add('current-status');
    } else if (progress < 100) {
        progressLabels[1].classList.add('current-status');
    } else {
        progressLabels[2].classList.add('current-status');
    }

    if (progress < 100) {
        // setTimeout(() => updateProgress(orderTime, deliveryTime), 1000); // Update every second
    }
}
  // Call updateProgress with orderTime and deliveryTime
  updateProgress(orderTime, deliveryTime);
  handleSearch();
}

renderTrackingPage()