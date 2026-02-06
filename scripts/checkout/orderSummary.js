import {cart, removeFromCart, updateDeliveryOption, calculateCartQuantity, updateQuantity} from "../../data/cart.js";
import {products, getProduct} from "../../data/products.js";
import {formatCurrency} from "../utils/money.js";
//import dayjs from 'https://unpkg.com/day.js@1.11.10/esm/index.js';
import { calculateDeliveryDate, deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js";


// const today = dayjs();
// const deliveryDate = today.add(7, 'days');
// console.log(deliveryDate.format('dddd, MMMM, D'));


export function renderOrderSummary() {
let cartSummaryHTML = '';

cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  const matchingProduct = getProduct(productId);

  
  const deliveryOptionId = cartItem.deliveryOptionId;

  const deliveryOption = getDeliveryOption(deliveryOptionId);

  let today = new Date();

  let daysToAdd = deliveryOption.deliveryDays;
  let futureDate = new Date(today);
  futureDate.setDate(today.getDate() + daysToAdd);

  let dateString = futureDate.toLocaleDateString('en-Us', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
});


  cartSummaryHTML += `
  <div class="cart-item-container 
    js-cart-item-container-${matchingProduct.id}">
  <div class="delivery-date">
    Delivery date: ${dateString}
  </div>

  <div class="cart-item-details-grid">
    <img class="product-image"
      src="${matchingProduct.image}">

    <div class="cart-item-details">
      <div class="product-name">
        ${matchingProduct.name}
      </div>
      <div class="product-price">
        ${matchingProduct.getPrice()}
      </div>
      <div class="product-quantity
      js-product-quantity-${matchingProduct.id}">
        <span>
          Quantity: <span class="quantity-label js-quantity-label" data-product-id="${matchingProduct.id}">${cartItem.quantity}</span>
        </span>
        <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
          Update
        </span>

        <input class="quantity-input js-quantity-input">
        <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProduct.id}">Save</span>

        <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
          Delete
        </span>
      </div>
    </div>

    <div class="delivery-options">
      <div class="delivery-options-title">
        Choose a delivery option:
      </div>
      ${deliveryOptionsHTML(matchingProduct, cartItem)}
    </div>
  </div>
</div>
  `;
});

function deliveryOptionsHTML(matchingProduct, cartItem) {
  let html = '';
  deliveryOptions.forEach((deliveryOption) => {
        const deliveryDate = calculateDeliveryDate(deliveryOption);

    const priceString = deliveryOption.priceCents === 0
     ? 'FREE'
     : `$${formatCurrency(deliveryOption.priceCents)} -`;

     const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html +=` 
     <div class="delivery-option js-delivery-option"
     data-product-id="${matchingProduct.id}"
     data-delivery-option-id="${deliveryOption.id}">
    <input type="radio"
    ${isChecked ? 'checked' : ''}
      class="delivery-option-input"
      name="delivery-option-${matchingProduct.id}">
    <div>
      <div class="delivery-option-date">
        ${deliveryDate}
      </div>
      <div class="delivery-option-price">
        ${priceString} Shipping
      </div>
    </div>
  </div>
  `
  });

  return html;
}

document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      container.remove();
      
      updateCartQuantity();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

  function updateCartQuantity() {
    renderCheckoutHeader();
  //if (quantityDisplayEl) {
    // quantityDisplayEl.innerHTML = `${cartQuantity} items;
 // }
  };
  updateCartQuantity();

  // document.querySelectorAll('.js-delete-link').forEach(button => {
  //   button.addEventListener ('click', () => {
  //     updateCartQuantity();
  //   });
  // });

     // document.addEventListener('DOMContentLoaded', () => {
   //   updateCartQuantity();
   // });

   document.querySelectorAll('.js-update-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-quantity-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`);
      
      container.classList.remove('is-editing-quantity');

      const quantityInput = container.querySelector('.js-quantity-input');
      const newQuantity = Number(quantityInput.value);

      if (isNaN(newQuantity) || newQuantity < 0 || newQuantity >= 1000) {
        alert('Please enter a valid quantity (0 - 999)');
        return;
      }
      
      updateQuantity(productId, newQuantity);

      const quantityLabel = container.querySelector('.js-quantity-label');
      quantityLabel.textContent = newQuantity;

      updateCartQuantity();
      renderPaymentSummary();
      renderCheckoutHeader();
    });
  });

      document.body.addEventListener('keydown', (e) => {
        if (e.target.classList.contains('js-quantity-input') && e.key ===  'Enter') {
          //console.log('Enter key detected on quantityinput')
          e.preventDefault();

          const container = e.target.closest('[class*="js-cart-item-container-"]');

          if (!container) return;

          const saveLink = container.querySelector('.js-save-quantity-link');
        if (saveLink) {
          saveLink.click();
        }
        }
      });

      document.querySelectorAll('.js-delivery-option')
      .forEach((element) => {
        element.addEventListener('click', () => {
          const {productId, deliveryOptionId} = element.dataset;
          updateDeliveryOption(productId, deliveryOptionId);
          renderOrderSummary();
          renderPaymentSummary();
        })
      })
    };



