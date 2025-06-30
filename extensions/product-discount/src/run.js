// @ts-check
import { DiscountApplicationStrategy } from "../generated/api";

// /**
//  * @typedef {import("../generated/api").RunInput} RunInput
//  * @typedef {import("../generated/api").FunctionRunResult} FunctionRunResult
//  */

// /**
//  * @type {FunctionRunResult}
//  */
const EMPTY_DISCOUNT = {
  discountApplicationStrategy: DiscountApplicationStrategy.First,
  discounts: [],
};

// /**
//  * @param {RunInput} input
//  * @returns {FunctionRunResult}
//  */
// export function run(input) {
//   const configuration = JSON.parse(
//     input?.discountNode?.metafield?.value ?? "{}"
//   );

//   return EMPTY_DISCOUNT;
// };
export function run(input) {
  const freeVariantId = 'gid://shopify/ProductVariant/51273050816693';
  const cartTotalThreshold = 75;

  const cartTotal = input.cart.lines.reduce((total, line) => {
    // Exclude the free gift from the cart total
    if (line.merchandise.id !== freeVariantId && line.cost?.totalAmount?.amount) {
      return total + parseFloat(line.cost.totalAmount.amount); // Already includes quantity
    }
    return total;
  }, 0);

  if (cartTotal < cartTotalThreshold) {
    return EMPTY_DISCOUNT;
  }

  const discounts = input.cart.lines
    .filter(line => line.merchandise.id === freeVariantId)
    .map(line => ({
      targets: [
        {
          productVariant: {
            id: line.merchandise.id,
          }
        }
      ],
      value: {
        percentage: {
          value: 100
        }
      },
      message: 'Free Gift',
    }));

  if (discounts.length === 0) {
    return EMPTY_DISCOUNT;
  }

  return {
    discountApplicationStrategy: DiscountApplicationStrategy.First,
    discounts: discounts,
  };
}
