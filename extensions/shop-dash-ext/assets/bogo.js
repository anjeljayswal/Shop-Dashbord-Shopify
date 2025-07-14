document.addEventListener("DOMContentLoaded", function () {
  const addToCartForm = document.querySelector('form[action="/cart/add"]');
  if (!addToCartForm) return;

  addToCartForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Stop default form submission

    const formData = new FormData(addToCartForm);
    const productId = formData.get("id");

    fetch("/cart/add.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: productId,
        quantity: 2, // 👈 Add 2 items for BOGO
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("BOGO added:", data);
        window.location.href = "/cart"; // Redirect to cart
      })
      .catch((err) => console.error("BOGO error:", err));
  });
});
