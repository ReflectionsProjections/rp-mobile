jest.mock('@/api/api', () => ({
  api: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

import type { RedemptionInfo } from '../redemptionUtils';
import {
  getMerchandiseItems,
  getTierDisplayName,
  mapBackendTierToFrontend,
} from '../redemptionUtils';

describe('scanner merchandise tiers', () => {
  const redemptionInfo: RedemptionInfo = {
    userId: 'attendee-id',
    currentTier: 'TIER3',
    redeemedTiers: ['TIER1'],
    redeemableTiers: ['TIER2', 'TIER3'],
  };

  it('maps backend tiers to the intended displayed prizes', () => {
    expect(
      getMerchandiseItems(redemptionInfo).map(({ tier, name }) => ({
        displayedTier: mapBackendTierToFrontend(tier),
        name,
      })),
    ).toEqual([
      { displayedTier: 'TIER0', name: 'Shirt' },
      { displayedTier: 'TIER1', name: 'Lanyard' },
      { displayedTier: 'TIER2', name: 'Keychain' },
      { displayedTier: 'TIER3', name: 'Tote Bag' },
    ]);
  });

  it('uses the same prize names for individual tier display', () => {
    expect(
      (['TIER1', 'TIER2', 'TIER3', 'TIER4'] as const).map((tier) => getTierDisplayName(tier)),
    ).toEqual(['Shirt', 'Lanyard', 'Keychain', 'Tote Bag']);
  });
});
