import { api } from '@/api/api';
import { path } from '@/api/types';
import type { TierMappedType, TierType } from '@/api/types';
import { tierMapping } from '@/constants/tierMapping';

export interface RedemptionInfo {
  userId: string;
  currentTier: TierMappedType;
  redeemedTiers: TierType[];
  redeemableTiers: TierType[];
}

export interface MerchandiseItem {
  tier: TierType;
  name: string;
  isRedeemed: boolean;
  isEligible: boolean;
}

/**
 * Fetches redemption information for a user
 */
export async function fetchRedemptionInfo(userId: string): Promise<RedemptionInfo> {
  const response = await api.get(path('/attendee/redeemable/:userId', { userId }));
  return response.data;
}

/**
 * Redeems a specific tier for a user
 */
export async function redeemTier(userId: string, tier: TierType): Promise<void> {
  await api.post('/attendee/redeem', { userId, tier });
}

/**
 * Maps backend tier to frontend display tier
 */
export function mapBackendTierToFrontend(backendTier: TierType): TierMappedType {
  return tierMapping[backendTier];
}

/**
 * Maps frontend display tier to backend tier
 */
export function mapFrontendTierToBackend(frontendTier: TierMappedType): TierType {
  const reverseMapping = Object.entries(tierMapping).find(([_, value]) => value === frontendTier);
  return reverseMapping ? (reverseMapping[0] as TierType) : 'TIER1';
}

/**
 * Gets merchandise items with their redemption status (using frontend display tiers)
 */
export function getMerchandiseItems(redemptionInfo: RedemptionInfo): MerchandiseItem[] {
  const items: MerchandiseItem[] = [
    { tier: 'TIER1', name: 'T-shirt', isRedeemed: false, isEligible: false },
    { tier: 'TIER2', name: 'Keychain', isRedeemed: false, isEligible: false },
    { tier: 'TIER3', name: 'Squishie', isRedeemed: false, isEligible: false },
    { tier: 'TIER4', name: 'Beanie', isRedeemed: false, isEligible: false },
  ];

  return items.map((item) => ({
    ...item,
    isRedeemed: redemptionInfo.redeemedTiers.includes(item.tier),
    isEligible: redemptionInfo.redeemableTiers.includes(item.tier),
  }));
}

/**
 * Checks if a user has redeemed their t-shirt (TIER1)
 */
export function hasRedeemedTshirt(redemptionInfo: RedemptionInfo): boolean {
  return redemptionInfo.redeemedTiers.includes('TIER1');
}

/**
 * Gets the display name for a tier
 */
export function getTierDisplayName(tier: TierType): string {
  const tierNames: Record<TierType, string> = {
    TIER1: 'T-shirt',
    TIER2: 'Keychain',
    TIER3: 'Squishie',
    TIER4: 'Beanie',
  };
  return tierNames[tier];
}

/**
 * Gets the tier level for comparison (lower number = higher tier)
 */
export function getTierLevel(tier: TierType): number {
  const tierLevels: Record<TierType, number> = {
    TIER1: 1,
    TIER2: 2,
    TIER3: 3,
    TIER4: 4,
  };
  return tierLevels[tier];
}
