/**
 * Dynamic pricing calculation for AgriConnect Hub
 * 
 * Formula: final_price = base_price_per_kg * quantity * (1 + distance_factor + demand_factor)
 * 
 * distance_factor:
 *   - 0-5km: 0
 *   - 5-15km: 0.05
 *   - >15km: 0.1
 * 
 * demand_factor:
 *   - High demand: 0.05
 *   - Normal: 0
 */

export function getDistanceFactor(distanceKm: number): number {
  if (distanceKm <= 5) return 0;
  if (distanceKm <= 15) return 0.05;
  return 0.1;
}

export function getDemandFactor(isHighDemand: boolean): number {
  return isHighDemand ? 0.05 : 0;
}

export function calculateItemPrice(
  basePricePerKg: number,
  quantity: number,
  distanceKm: number,
  isHighDemand: boolean
): number {
  const distanceFactor = getDistanceFactor(distanceKm);
  const demandFactor = getDemandFactor(isHighDemand);
  const multiplier = 1 + distanceFactor + demandFactor;
  
  return basePricePerKg * quantity * multiplier;
}

export function calculateTotalPrice(
  items: Array<{
    pricePerKg: number;
    quantity: number;
    isHighDemand: boolean;
  }>,
  distanceKm: number
): number {
  return items.reduce((total, item) => {
    return total + calculateItemPrice(
      item.pricePerKg,
      item.quantity,
      distanceKm,
      item.isHighDemand
    );
  }, 0);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  }).format(amount);
}
