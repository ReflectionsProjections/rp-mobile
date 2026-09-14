import {
  getPointShopMilestoneStates,
  getPointShopProgressWidth,
  getPointShopTier,
  POINT_SHOP_MILESTONES,
  POINT_SHOP_TIERS,
  POINT_SHOP_TRACK_WIDTH,
} from '../pointShopProgress';

describe('point shop progress', () => {
  it('uses the milestone values shown by the design', () => {
    expect(POINT_SHOP_MILESTONES).toEqual([40, 60, 90]);
    expect(POINT_SHOP_TIERS.map(({ tier, name, pointThreshold }) => ({
      tier,
      name,
      pointThreshold,
    }))).toEqual([
      { tier: 'TIER0', name: 'Shirt', pointThreshold: 0 },
      { tier: 'TIER1', name: 'Lanyard', pointThreshold: 40 },
      { tier: 'TIER2', name: 'Keychain', pointThreshold: 60 },
      { tier: 'TIER3', name: 'Tote Bag', pointThreshold: 90 },
    ]);
  });

  it('maps points to the 355-unit SVG track', () => {
    expect(getPointShopProgressWidth(0)).toBe(0);
    expect(getPointShopProgressWidth(45)).toBe(POINT_SHOP_TRACK_WIDTH / 2);
    expect(getPointShopProgressWidth(90)).toBe(POINT_SHOP_TRACK_WIDTH);
  });

  it('clears each milestone only when its threshold is reached', () => {
    expect(getPointShopMilestoneStates(39)).toEqual([false, false, false]);
    expect(getPointShopMilestoneStates(40)).toEqual([true, false, false]);
    expect(getPointShopMilestoneStates(60)).toEqual([true, true, false]);
    expect(getPointShopMilestoneStates(90)).toEqual([true, true, true]);
    expect(getPointShopMilestoneStates(Number.NaN)).toEqual([false, false, false]);
  });

  it('derives the highest unlocked tier from cumulative points', () => {
    expect(getPointShopTier(0)).toBe('TIER0');
    expect(getPointShopTier(39)).toBe('TIER0');
    expect(getPointShopTier(40)).toBe('TIER1');
    expect(getPointShopTier(59)).toBe('TIER1');
    expect(getPointShopTier(60)).toBe('TIER2');
    expect(getPointShopTier(90)).toBe('TIER3');
    expect(getPointShopTier(500)).toBe('TIER3');
    expect(getPointShopTier(Number.NaN)).toBe('TIER0');
  });

  it('tracks animation progress and clamps out-of-range values', () => {
    expect(getPointShopProgressWidth(90, 0.5)).toBe(POINT_SHOP_TRACK_WIDTH / 2);
    expect(getPointShopProgressWidth(90)).toBe(POINT_SHOP_TRACK_WIDTH);
    expect(getPointShopProgressWidth(-5)).toBe(0);
    expect(getPointShopProgressWidth(Number.NaN)).toBe(0);
  });
});
