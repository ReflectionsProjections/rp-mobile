import { buildProfileRoleChips, resolveProfileDisplayName } from '../profileUtils';

describe('resolveProfileDisplayName', () => {
  it('prefers the account display name', () => {
    expect(
      resolveProfileDisplayName({
        displayName: '  Racer One  ',
        staffName: 'Staff Name',
        email: 'racer@example.com',
      }),
    ).toBe('Racer One');
  });

  it('falls back to the staff name and then email', () => {
    expect(resolveProfileDisplayName({ displayName: ' ', staffName: 'Dev Staff' })).toBe(
      'Dev Staff',
    );
    expect(
      resolveProfileDisplayName({ displayName: '', staffName: '', email: 'rp@example.com' }),
    ).toBe('rp@example.com');
  });
});

describe('buildProfileRoleChips', () => {
  it('uses attendee when USER is the only role', () => {
    expect(buildProfileRoleChips(['USER'])).toEqual(['Attendee']);
  });

  it('puts the staff team before account roles and removes duplicates', () => {
    expect(buildProfileRoleChips(['USER', 'STAFF', 'staff'], 'DEV')).toEqual(['Dev', 'Staff']);
  });

  it('preserves both staff and admin roles', () => {
    expect(buildProfileRoleChips(['ADMIN', 'STAFF'], 'FULL TEAM')).toEqual([
      'Full Team',
      'Admin',
      'Staff',
    ]);
  });
});
