import { calculateCartQuantity } from "../../data/cart.js";

export function renderCheckoutHeader() {
 const checkoutHeaderHTML = `
  Checkout (<a class="return-to-home-link js-return-to-home-link"
  href="amazon.html"></a>)
  `

  document.querySelector('.js-checkout-header-middle-section')
    .innerHTML = checkoutHeaderHTML;
    
  const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-return-to-home-link').innerHTML = `${cartQuantity} items`;
  //console.log(cartQuantity);
}