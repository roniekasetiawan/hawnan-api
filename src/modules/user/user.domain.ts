import type { CreateUserInput, UpdateUserInput } from '@/modules/user/user.schema';

export type UserDomainProps = {
  email: string;
  name: string | null;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeName(name?: string | null): string | null {
  if (name == null) return null;
  const trimmed = name.trim();
  return trimmed === '' ? null : trimmed;
}

export function buildNewUserProps(input: CreateUserInput): UserDomainProps {
  return {
    email: normalizeEmail(input.email),
    name: normalizeName(input.name),
  };
}

export function applyUserProfileUpdate(
  current: UserDomainProps,
  input: UpdateUserInput,
): UserDomainProps {
  return {
    email: input.email ? normalizeEmail(input.email) : current.email,
    name: input.name !== undefined ? normalizeName(input.name) : current.name,
  };
}
