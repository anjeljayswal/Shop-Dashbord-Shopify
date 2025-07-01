document.addEventListener("DOMContentLoaded", async function () {
  const freeGiftVariantId = 51273050816693; // Use numeric ID only
  const cartApiUrl = "/cart.js";
  const addToCartUrl = "/cart/add.js";
  const changeCartUrl = "/cart/change.js";

  // Fetch current cart
  async function fetchCart() {
    const res = await fetch(cartApiUrl);
    return await res.json();
  }

  // Add the gift product
  async function addGiftToCart() {
    return await fetch(addToCartUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: freeGiftVariantId,
        quantity: 1
      })
    });
  }

  // Force quantity to 1 if increased
  async function limitGiftQuantity(lineItemKey) {
    return await fetch(changeCartUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: lineItemKey,
        quantity: 1
      })
    });
  }

  // Run logic
  const cart = await fetchCart();

  const giftItem = cart.items.find(item => item.variant_id === freeGiftVariantId);

  // Calculate total cart amount (excluding gift)
  const cartTotal = cart.items.reduce((sum, item) => {
    return item.variant_id === freeGiftVariantId
      ? sum
      : sum + item.final_line_price / 100;
  }, 0);

  // If cart ≥ 1000 and gift not added — add it
  if (cartTotal >= 1000) {
    if (!giftItem) {
      await addGiftToCart();
      location.reload(); // Refresh to show in cart
    } else if (giftItem.quantity > 1) {
      await limitGiftQuantity(giftItem.key); // Reset to 1
      location.reload();
    }
  }

  // Optional: Remove gift if cart below threshold
  else if (giftItem) {
    await fetch(changeCartUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: giftItem.key,
        quantity: 0
      })
    });
    location.reload(); // Remove and refresh
  }
});
