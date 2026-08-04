import {
  getPointShopMilestoneStates,
  getPointShopProgressWidth,
  POINT_SHOP_MILESTONES,
  POINT_SHOP_TRACK_WIDTH,
} from '../pointShopProgress';

describe('point shop progress', () => {
  it('uses the milestone values shown by the design', () => {
    expect(POINT_SHOP_MILESTONES).toEqual([5, 15, 25, 35, 45]);
  });

  it('maps points to the 355-unit SVG track', () => {
    expect(getPointShopProgressWidth(0)).toBe(0);
    expect(getPointShopProgressWidth(12)).toBeCloseTo(94.667);
    expect(getPointShopProgressWidth(45)).toBe(POINT_SHOP_TRACK_WIDTH);
  });

  it('clears each milestone only when its threshold is reached', () => {
    expect(getPointShopMilestoneStates(0)).toEqual([false, false, false, false, false]);
    expect(getPointShopMilestoneStates(12)).toEqual([true, false, false, false, false]);
    expect(getPointShopMilestoneStates(15)).toEqual([true, true, false, false, false]);
    expect(getPointShopMilestoneStates(35)).toEqual([true, true, true, true, false]);
    expect(getPointShopMilestoneStates(45)).toEqual([true, true, true, true, true]);
    expect(getPointShopMilestoneStates(Number.NaN)).toEqual([false, false, false, false, false]);
  });

  it('tracks animation progress and clamps out-of-range values', () => {
    expect(getPointShopProgressWidth(45, 0.5)).toBe(POINT_SHOP_TRACK_WIDTH / 2);
    expect(getPointShopProgressWidth(90)).toBe(POINT_SHOP_TRACK_WIDTH);
    expect(getPointShopProgressWidth(-5)).toBe(0);
    expect(getPointShopProgressWidth(Number.NaN)).toBe(0);
  });
});
