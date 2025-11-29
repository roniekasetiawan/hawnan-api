import { describe, it, expect } from 'bun:test';
import {
  normalizeEmail,
  normalizeName,
  buildNewUserProps,
  applyUserProfileUpdate,
  type UserDomainProps,
} from './user.domain';
import type { CreateUserInput, UpdateUserInput } from './user.schema';

describe('User Domain', () => {
  describe('normalizeEmail', () => {
    it('should trim leading and trailing whitespace', () => {
      const email = '  test@example.com  ';
      expect(normalizeEmail(email)).toBe('test@example.com');
    });

    it('should convert email to lower case', () => {
      const email = 'TEST@EXAMPLE.COM';
      expect(normalizeEmail(email)).toBe('test@example.com');
    });

    it('should trim and convert to lower case', () => {
      const email = '  TEST@EXAMPLE.COM  ';
      expect(normalizeEmail(email)).toBe('test@example.com');
    });
  });

  describe('normalizeName', () => {
    it('should return null for null input', () => {
      expect(normalizeName(null)).toBeNull();
    });

    it('should return null for undefined input', () => {
      expect(normalizeName(undefined)).toBeNull();
    });

    it('should trim leading and trailing whitespace from name', () => {
      const name = '  John Doe  ';
      expect(normalizeName(name)).toBe('John Doe');
    });

    it('should return null for an empty string', () => {
      const name = '';
      expect(normalizeName(name)).toBeNull();
    });

    it('should return null for a string with only whitespace', () => {
      const name = '   ';
      expect(normalizeName(name)).toBeNull();
    });
  });

  describe('buildNewUserProps', () => {
    it('should correctly build user properties with normalized email and name', () => {
      const input: CreateUserInput = {
        email: '  TEST@EXAMPLE.COM  ',
        name: '  John Doe  ',
        password: 'password123',
      };
      const result = buildNewUserProps(input);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('John Doe');
      expect(result.password).toBeString();
      expect(result.password).not.toBe('password123');
    });

    it('should handle null name', () => {
      const input: CreateUserInput = {
        email: 'test@example.com',
        name: null,
        password: 'password123',
      };
      const result = buildNewUserProps(input);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBeNull();
      expect(result.password).toBeString();
    });
  });

  describe('applyUserProfileUpdate', () => {
    const currentUser: UserDomainProps = {
      email: 'current@example.com',
      name: 'Current Name',
    };

    it('should update only the email', () => {
      const input: UpdateUserInput = { email: '  NEW@EXAMPLE.COM  ' };
      const expected: UserDomainProps = {
        email: 'new@example.com',
        name: 'Current Name',
      };
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(expected);
    });

    it('should update only the name', () => {
      const input: UpdateUserInput = { name: '  New Name  ' };
      const expected: UserDomainProps = {
        email: 'current@example.com',
        name: 'New Name',
      };
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(expected);
    });

    it('should update name to null', () => {
      const input: UpdateUserInput = { name: null };
      const expected: UserDomainProps = {
        email: 'current@example.com',
        name: null,
      };
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(expected);
    });

    it('should not update name if it is undefined', () => {
      const input: UpdateUserInput = { name: undefined };
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(currentUser);
    });

    it('should update both email and name', () => {
      const input: UpdateUserInput = {
        email: 'another@example.com',
        name: 'Another Name',
      };
      const expected: UserDomainProps = {
        email: 'another@example.com',
        name: 'Another Name',
      };
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(expected);
    });

    it('should return current properties if input is empty', () => {
      const input: UpdateUserInput = {};
      expect(applyUserProfileUpdate(currentUser, input)).toEqual(currentUser);
    });
  });
});
