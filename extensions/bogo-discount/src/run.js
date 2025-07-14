import { DiscountApplicationStrategy } from "../generated/api";

export function run(input) {
  const discounts = [];

  for (const line of input.cart.lines) {
    const tags = line.merchandise.product.tags ;
    if (tags.includes("BOGO")) {
      // For every 2 items, 1 is free
      const freeQty = Math.floor(line.quantity / 2);
      if (freeQty > 0) {
        discounts.push({
          targets: [
            {
              productVariant: {
                id: line.merchandise.id,
              },
              quantity: freeQty,
            },
          ],
          value: {
            percentage: {
              value: 100,
            },
          },
          message: "Buy 1 Get 1 Free",
        });
      }
    }
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts,
  };
}