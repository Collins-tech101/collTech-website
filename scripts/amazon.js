import {cart, addToCart} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import { calculateCartQuantity } from '../data/cart.js';
import { handleSearch } from './utils/search.js';

const urlParams = new URLSearchParams(window.location.search);
const searchQuery = urlParams.get('search');

let filteredProducts = products;
if (searchQuery) {
  const searchQueryLower = searchQuery.toLowerCase();
  filteredProducts = products.filter(product => {
    const nameIncludesQuery = product.name.toLowerCase().includes(searchQueryLower);
    const keywordIncludesQuery = (product.keywords || []).some(keyword => keyword.toLowerCase().includes(searchQueryLower));
    return nameIncludesQuery || keywordIncludesQuery;
  });
}

if (filteredProducts.length === 0) {
  document.querySelector('.js-products-grid').innerHTML = `
    <div class="no-products-found">
      <h2>Product not found!</h2>
      <p>Sorry, we couldn't find any products matching "${searchQuery}".</p>
      <p>Try searching for something else or check our <a href="index.html">products</a>.</p>
    </div>
  `;
} else {
let productsHTML = '';

filteredProducts.forEach((product) => {
  productsHTML += `
    <div class="product-container">
      <div class="product-image-container">
        <img class="product-image"
          src="${product.image}">
      </div>

      <div class="product-name limit-text-to-2-lines">
        ${product.name}
      </div>

      <div class="product-rating-container">
        <img class="product-rating-stars"
          src="${product.getStarsUrl()}">
        <div class="product-rating-count link-primary">
          ${product.rating.count}
        </div>
      </div>

      <div class="product-price">
        ${product.getPrice()}
      </div>

      <div class="product-quantity-container">
        <select class="js-quantity-selector-${product.id}">
          <option selected value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
          <option value="10">10</option>
        </select>
      </div>

      ${product.extraInfoHTML()}

      <div class="product-spacer"></div>

       <div class="added-to-cart js-added-message-${product.id}">
        <img src="images/icons/checkmark.png">
        Added
      </div>

      <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id}">
        Add to Cart
      </button>
    </div>
  `;
});
document.querySelector('.js-products-grid').innerHTML = productsHTML;
}


export function updateCartQuantity() {
 const cartQuantity = calculateCartQuantity();
  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;
};
updateCartQuantity();
// document.addEventListener('DOMContentLoaded', () => {
//   updateCartQuantity();
// });


document.querySelectorAll('.js-add-to-cart')
  .forEach((button) => {
    button.addEventListener('click', () => {
      const productId = button.dataset.productId;

      const addedMessageElement = document.querySelector(`.js-added-message-${productId}`);
      // console.log(addedMessageElement)
    
      addedMessageElement.classList.add('added-to-cart-visible');

      clearTimeout(button.timeoutId)
     button.timeoutId = setTimeout(() => {
        addedMessageElement.classList.remove('added-to-cart-visible');
      }, 2000)

      addToCart(productId);
      updateCartQuantity();
    });
  });

handleSearch();

