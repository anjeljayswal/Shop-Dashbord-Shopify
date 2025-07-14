document.addEventListener("DOMContentLoaded", () => {
  const bogoVariantIds = ["51273050816693", "51273050816694", "51273050816695"]; // Add more as needed

  document.querySelectorAll('input[name="updates[]"]').forEach((input) => {
    const itemRow = input.closest("tr");

    if (!itemRow) return;

    const variantId = itemRow?.dataset?.variantId;

    if (bogoVariantIds.includes(variantId)) {
      input.setAttribute("readonly", true);
      input.style.background = "#f5f5f5";

      const note = document.createElement("div");
      note.textContent = "🎁 BOGO item – quantity locked";
      note.style.fontSize = "12px";
      note.style.marginTop = "4px";
      itemRow.appendChild(note);
    }
  });
});
