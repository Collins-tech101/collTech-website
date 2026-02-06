import { calculateDeliveryDate, calculateDeliveryDateObj, getDeliveryOption } from "./deliveryOptions.js";
import { getProduct } from "./products.js";
export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [{
    productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
    deliveryOptionId: '1'
  }, {
    productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1,
    deliveryOptionId: '2'
  }];

}
}

function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function addToCart(productId, quantity = null) {
  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

      const selectElement = document.querySelector(`.js-quantity-selector-${productId}`);
    const selectedQuantity = quantity !== null ? quantity : Number(selectElement.value);

  if (matchingItem) {
    matchingItem.quantity += selectedQuantity;
  } else (
    cart.push({ 
      productId, 
      quantity: selectedQuantity, 
      deliveryOptionId: '1' 
    })
  );

  saveToStorage();
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;

  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateQuantity(productId, newQuantity) {
   const productIndex = cart.findIndex(item => item.productId === productId);

   if (productIndex !== -1) {
    cart[productIndex].quantity = newQuantity;
    saveToStorage();
   } else {
    console.error(`Product ID ${productId} not found in cart`);
   }
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem = cart.find(cartItem => cartItem.productId === productId);

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;

  saveToStorage();
}

export function getCartProducts() {
  return cart.map(cartItem => {
    const product = getProduct(cartItem.productId);
    const deliveryOption = getDeliveryOption(cartItem.deliveryOptionId);
    const deliveryDateObj = calculateDeliveryDateObj(deliveryOption);
    return {
      productId: cartItem.productId,
      name: product.name,
      image: product.image,
      deliveryDate: deliveryDateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric'
      }),
      quantity: cartItem.quantity
    };
  });
}