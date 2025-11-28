/**
 * Calculate shipping cost based on cart subtotal
 * @param {number} subtotal - The cart subtotal amount
 * @returns {number} The shipping cost
 * 
 * Shipping Rules:
 * - Free shipping for orders >= $200
 * - $25 shipping for orders >= $100 and < $200
 * - $50 shipping for orders < $100
 */
export const calculateShippingCost = (subtotal) => {
  if (subtotal >= 200) {
    return 0; // Free shipping
  } else if (subtotal >= 100 && subtotal < 200) {
    return 25; // $25 shipping
  } else {
    return 50; // $50 shipping
  }
};
