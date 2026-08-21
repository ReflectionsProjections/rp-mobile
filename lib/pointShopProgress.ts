export const POINT_SHOP_MAX_POINTS = 45;
export const POINT_SHOP_TRACK_WIDTH = 355;
export const POINT_SHOP_MILESTONES = [5, 15, 25, 35, 45] as const;

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
