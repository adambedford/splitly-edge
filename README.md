# splitly-edge

## Add Script to Site

```javascript
function(r,u,b,i,x){
if(r[b])return;r[b]=[];r.rubix=function(){
r[b].push(arguments)};x=u.createElement('script');
x.async=!0;x.src='https://rubix.click/pixels.js';
u.head.appendChild(x)}(window,document,'rbxfn');

!function(s,p,l,i,t){
  if(s[l]) return;
  s[l] = [];
  t = p.createElement('script');
  t.async=!0;
  t.src='YOUR_SITE_SUBDOMAIN/tracker.js';
  p.head.appendChild(t)
}(window, document, 'splfn')



var tag = document.createElement("script");
tag.src = "YOUR_SITE_SUBDOMAIN/tracker.js";
document.getElementsByTagName("head")[0].appendChild(tag);
```

## Shopify Pixel Installation

```javascript

```
