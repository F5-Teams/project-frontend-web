/**
 * Format currency to Vietnamese Dong (VNĐ) with thousands separator
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "75.000 VNĐ")
 */
export const formatCurrency = (amount: number): string => {
  // Convert to string and add thousands separators
  const formattedAmount = amount
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${formattedAmount} VNĐ`;
};

/**
 * Format currency for display in cart items
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "75.000 VNĐ")
 */
export const formatPrice = formatCurrency;

/**
 * Format currency for deposit display
 * @param amount - The amount to format
 * @returns Formatted currency string (e.g., "75.000 VNĐ")
 */
export const formatDeposit = formatCurrency;
