import type { TierMappedType } from '@/api/types';

export const POINT_SHOP_MAX_POINTS = 90;
export const POINT_SHOP_TRACK_WIDTH = 355;
export const POINT_SHOP_MILESTONES = [40, 60, 90] as const;

export const POINT_SHOP_TIERS = [
  { tier: 'TIER0', name: 'Shirt', pointThreshold: 0 },
  { tier: 'TIER1', name: 'Lanyard', pointThreshold: 40, inventory: 250 },
  { tier: 'TIER2', name: 'Keychain', pointThreshold: 60, inventory: 200 },
  { tier: 'TIER3', name: 'Tote Bag', pointThreshold: 90, inventory: 75 },
] as const satisfies readonly {
  tier: TierMappedType;
  name: string;
  pointThreshold: number;
  inventory?: number;
}[];

export function getPointShopTier(points: number): TierMappedType {
  const safePoints = Number.isFinite(points) ? Math.max(0, points) : 0;
  const unlockedTiers = POINT_SHOP_TIERS.filter(({ pointThreshold }) => safePoints >= pointThreshold);
  return unlockedTiers.at(-1)?.tier ?? 'TIER0';
}

export function getPointShopMilestoneStates(points: number): boolean[] {
  const safePoints = Number.isFinite(points) ? Math.max(0, points) : 0;
  return POINT_SHOP_MILESTONES.map((milestone) => safePoints >= milestone);
}

export function getPointShopProgressWidth(points: number, animationProgress = 1): number {
  const safePoints = Number.isFinite(points) ? Math.max(0, points) : 0;
  const safeAnimationProgress = Number.isFinite(animationProgress)
    ? Math.min(Math.max(animationProgress, 0), 1)
    : 0;

  return (
    POINT_SHOP_TRACK_WIDTH * Math.min(safePoints / POINT_SHOP_MAX_POINTS, 1) * safeAnimationProgress
  );
}
