// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";


const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};


export function run(input) {
  const discounts = [];

  for (const line of input.cart.lines) {
    const tags = line.merchandise.product.tags || [];
    let freeQty = 0;
    let rule = null;

    if (tags.includes("BOGO")) {
      // Buy 1 Get 1 Free: For every 2, 1 is free
      freeQty = Math.floor(line.quantity / 2);
      rule = "BOGO";
    } else if (tags.includes("BUY3GET1")) {
      // Buy 3 Get 1 Free: For every 4, 1 is free
      freeQty = Math.floor(line.quantity / 4);
      rule = "BUY3GET1";
    } else if (tags.includes("BUY4GET2")) {
      // Buy 4 Get 2 Free: For every 6, 2 are free
      freeQty = Math.floor(line.quantity / 6) * 2;
      rule = "BUY4GET2";
    }

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
        message:
          rule === "BOGO"
            ? "Buy 1 Get 1 Free"
            : rule === "BUY3GET1"
            ? "Buy 3 Get 1 Free"
            : rule === "BUY4GET2"
            ? "Buy 4 Get 2 Free"
            : "Free item",
      });
    }
    console.log("Product ID:", line.merchandise.id);
console.log("Tags:", tags);
console.log("Applied rule:", rule);
console.log("Free quantity calculated:", freeQty);
  }

  if (discounts.length === 0) {
    return EMPTY_DISCOUNT;
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts,
  };
}