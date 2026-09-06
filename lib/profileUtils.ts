type ProfileIdentityInput = {
  displayName?: string | null;
  staffName?: string | null;
  email?: string | null;
};

const cleaned = (value?: string | null) => value?.trim() || '';

export function resolveProfileDisplayName({
  displayName,
  staffName,
  email,
}: ProfileIdentityInput): string {
  return cleaned(displayName) || cleaned(staffName) || cleaned(email) || 'R|P MEMBER';
}

const titleCase = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export function buildProfileRoleChips(roles: string[] = [], staffTeam?: string | null): string[] {
  const chips: string[] = [];

  const addChip = (value?: string | null) => {
    const normalized = cleaned(value);
    if (!normalized) return;

    const label = titleCase(normalized);
    if (!chips.some((chip) => chip.toLowerCase() === label.toLowerCase())) {
      chips.push(label);
    }
  };

  addChip(staffTeam);
  roles.forEach((role) => {
    if (cleaned(role).toUpperCase() !== 'USER') addChip(role);
  });

  if (chips.length === 0) chips.push('Attendee');
  return chips;
}
