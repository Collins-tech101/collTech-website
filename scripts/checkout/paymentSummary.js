import { cart, calculateCartQuantity, getCartProducts } from "../../data/cart.js";
import { getProduct, products } from "../../data/products.js";
import { getDeliveryOption } from "../../data/deliveryOptions.js";
import { formatCurrency } from "../utils/money.js";
import { addOrder } from "../../data/orders.js";

export function renderPaymentSummary() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach((cartItem) => {
   const product = getProduct(cartItem.productId);
   productPriceCents += product.priceCents * cartItem.quantity;

  const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);

  shippingPriceCents += deliveryOption.priceCents;
  });
  
  const totalBeforTaxCents = productPriceCents + shippingPriceCents;
  const taxCents = totalBeforTaxCents * 0.1;
  const totalCents = totalBeforTaxCents + taxCents;


  const paymentSummaryHTML = `
      <div class="payment-summary-title">
      Order Summary
    </div>

    <div class="payment-summary-row">
      <div>Items (${calculateCartQuantity()}):</div>
      <div class="payment-summary-money">
      $${formatCurrency(productPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">
      $${formatCurrency(shippingPriceCents)}
      </div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalBeforTaxCents)}
      </div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">
      $${formatCurrency(taxCents)}
      </div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">
      $${formatCurrency(totalCents)}
      </div>
    </div>

    <button class="place-order-button button-primary js-place-order">
      Place your order
    </button>
  `;

  document.querySelector('.js-payment-summary')
    .innerHTML = paymentSummaryHTML;

    // document.querySelector('.js-place-order')
    // .addEventListener('click', async () => {
    //   try {
    //     const response = await fetch('https://supersimplebackend.dev/orders', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({
    //       cart: cart
    //     })
    //   });

    //   const order = await response.json();
    //   addOrder(order);
    //   console.log(order);

    //   } catch (error) {
    //     console.log('Unexpected error. Try again later.')
    //   }

    //   window.location.href = 'orders.html';
    // });

    function generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      })
    }
    
    document.querySelector('.js-place-order').addEventListener('click', () => {
      const order = {
        id: generateUUID(),
        orderTime: new Date().toISOString(),
        totalCostCents: totalCents,
        products: getCartProducts()
      };
      addOrder(order);
      cart.length = 0; // clear cart
      localStorage.setItem('cart', JSON.stringify(cart));
      window.location.href = 'orders.html';
    });
}