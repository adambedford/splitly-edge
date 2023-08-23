# splitly-edge

## Add Script to Site

```javascript
!function(s,p,l,i,t){
  if(s[l]) return;
  s[l] = [];
  t = p.createElement('script');
  t.async=!0;
  t.src='YOUR_SITE_SUBDOMAIN/tracker.js';
  p.head.appendChild(t)
}(window, document, 'splfn')
```

## Shopify Pixel Installation

```javascript
analytics.subscribe("checkout_completed", event => {
  splitly.trackEvent("purchase", {
    amount: event.data.checkout.subtotalPrice.amount,
    currency: event.data.checkout.currencyCode
  })
})

analytics.subscribe("product_added_to_cart", event => {
  splitly.trackEvent("add_to_cart", {
    product_id: event.data.cartLine.merchandise.product.id,
    product_title: event.data.cartLine.merchandise.product.title,
    product_variant_id: event.data.cartLine.merchandise.id,
    product_variant_title: event.data.cartLine.merchandise.title,
    quantity: event.data.cartLine.quantity,
    amount: event.data.cartLine.cost.totalAmount.amount,
    currency: event.data.cartLine.cost.totalAmount.currencyCode
  })
})
```
