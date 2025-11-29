import type { CreateUserInput, UpdateUserInput } from '@/modules/user/user.schema';
import bcrypt from 'bcryptjs';

export type UserDomainProps = {
  email: string;
  name: string | null;
  password?: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function normalizeName(name?: string | null): string | null {
  if (name == null) return null;
  const trimmed = name.trim();
  return trimmed === '' ? null : trimmed;
}

export function buildNewUserProps(input: CreateUserInput) {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(input.password, salt);

  return {
    email: normalizeEmail(input.email),
    name: normalizeName(input.name),
    password: hashedPassword,
  };
}

export function applyUserProfileUpdate(
  current: UserDomainProps,
  input: UpdateUserInput,
): Omit<UserDomainProps, 'password'> {
  return {
    email: input.email ? normalizeEmail(input.email) : current.email,
    name: input.name !== undefined ? normalizeName(input.name) : current.name,
  };
}
