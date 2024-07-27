import { cart, removeFromCart, updateQuantity, updateDeliveryOption } from "../data/cart.js";
import { products } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "../data/deliveryOptions.js";

const today = dayjs();
const deliveryDate = today.add(7, 'days');
console.log(deliveryDate.format('dddd, MMMM D'));

updateCardQuantity();

function updateCardQuantity() {
  let cartQuantity = 0;

    cart.forEach((cartItem) => {
      cartQuantity += cartItem.quantity;
    });
    

    document.querySelector('.js-checkout-link').innerHTML = `${cartQuantity} Items`;
}

let cartSummaryHTML = '';

cart.forEach((cartItem) => {
    const productId = cartItem.productId;

    let matchingProducts;

    products.forEach((productItem, index) => {
        if (productItem.id === productId) {
            matchingProducts = productItem;
        }
    });

    const deliveryOptionId = cartItem.deliveryOptionId;

    let deliveryOption;

    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    
    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container-${matchingProducts.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProducts.image}">

          <div class="cart-item-details">
            <div class="product-name">
              ${matchingProducts.name}
            </div>
            <div class="product-price">
              ${formatCurrency(matchingProducts.priceCents)}
            </div>
            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label js-quantity-label-${matchingProducts.id}">${cartItem.quantity}</span>
              </span>
              <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProducts.id}">
                Update
              </span>
              <input class="quantity-input js-quantity-input-${matchingProducts.id} js-input-field">
              <span class="save-quantity-link link-primary js-save-quantity-link" data-product-id="${matchingProducts.id}">
              Save
              </span>
              <span class="delete-quantity-link link-primary js-delete-links" data-product-id="${matchingProducts.id}">
                Delete
              </span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">
              Choose a delivery option:
            </div>
            ${deliveryOptionsHTML(matchingProducts, cartItem)}
          </div>
        </div>
      </div>
    `;
});

function deliveryOptionsHTML (matchingProducts, cartItem) {
  let HTML = '';

  deliveryOptions.forEach((deliveryOptions) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryOptions.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOptions.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOptions.priceCents)} -`;

    const isChecked = deliveryOptions.id === cartItem.deliveryOptionId;

    HTML += `
      <div class="delivery-option js-delivery-option"
      data-product-id="${matchingProducts.id}"
      data-delivery-option-id="${deliveryOptions.id}">
        <input type="radio"
          ${isChecked ? 'checked' : ''}
          class="delivery-option-input"
          name="delivery-option-${matchingProducts.id}">
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString} Shipping
          </div>
        </div>
      </div>
    `;
  });

  return HTML;
}

document.querySelector('.js-order-summary').innerHTML += cartSummaryHTML;

document.querySelectorAll('.js-delete-links').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    removeFromCart(productId);
    
    
    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    container.remove();
    updateCardQuantity();
  });
});


document.querySelectorAll('.js-update-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    console.log(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    container.classList.add('is-editing-quantity');
  });
});


document.querySelectorAll('.js-save-quantity-link').forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;

    const container = document.querySelector(`.js-cart-item-container-${productId}`);

    container.classList.remove('is-editing-quantity');

    const inputElement = document.querySelector(`.js-quantity-input-${productId}`);

    const quantityInput = Number(inputElement.value);

    console.log(quantityInput);
    updateQuantity(productId, quantityInput);

    const newQuantity = document.querySelector(`.js-quantity-label-${productId}`);
    newQuantity.innerHTML = quantityInput

    updateCardQuantity();
  });
});


document.querySelectorAll('.js-delivery-option').forEach((element) => {
  element.addEventListener('click', () => {
    const { productId, deliveryOptionId } = element.dataset;
    updateDeliveryOption(productId, deliveryOptionId);
    window.location.reload();
    
  });
});
