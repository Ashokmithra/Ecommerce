export const getDiscountAmount = (
  originalPrice: number,
  discountPercentage: number,
): number => {
  return Number(
    (originalPrice - (originalPrice * discountPercentage) / 100).toFixed(2),
  );
};
