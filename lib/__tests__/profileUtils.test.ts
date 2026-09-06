import {
  buildProfileRoleChips,
  getProfileCapabilities,
  resolveProfileDisplayName,
} from '../profileUtils';

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

describe('getProfileCapabilities', () => {
  it('keeps attendee profile functionality enabled for USER accounts', () => {
    expect(getProfileCapabilities(['USER'])).toMatchObject({
      canEditAvatar: true,
      canOpenScanner: true,
      showsAttendeeProgress: true,
      usesStaffProfileData: false,
    });
  });

  it('gives staff scanner access without enabling attendee functionality', () => {
    expect(getProfileCapabilities(['staff'])).toMatchObject({
      canEditAvatar: false,
      canOpenScanner: true,
      showsAttendeeProgress: false,
      usesStaffProfileData: true,
    });
  });

  it('preserves both sets of functionality for mixed-role accounts', () => {
    expect(getProfileCapabilities(['USER', 'STAFF'])).toMatchObject({
      canEditAvatar: true,
      canOpenScanner: true,
      showsAttendeeProgress: true,
      usesStaffProfileData: true,
    });
  });

  it('does not route an admin-only account to an unsupported scanner', () => {
    expect(getProfileCapabilities(['ADMIN'])).toMatchObject({
      canEditAvatar: false,
      canOpenScanner: false,
      showsAttendeeProgress: false,
      usesStaffProfileData: true,
    });
  });
});
