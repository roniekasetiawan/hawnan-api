import { describe, test, expect, vi, beforeEach, Mock } from 'bun:test';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { Logger } from '@/utils/logger/logger';
import { UserNotFoundError, UserAlreadyExistsError } from './user.errors';
import { CreateUserInput, UpdateUserInput } from './user.schema';
import { User } from '@/generated/prisma';

// Mocks
const mockUserRepository: UserRepository = {
  findAll: vi.fn(),
  findById: vi.fn(),
  findByEmail: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  withTx: vi.fn(),
} as unknown as UserRepository;

const mockLogger: Logger = {
  info: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  debug: vi.fn(),
};

describe('UserService', () => {
  let userService: UserService;

  beforeEach(() => {
    vi.clearAllMocks();
    userService = new UserService({ userRepository: mockUserRepository, log: mockLogger });
  });

  // Test data
  const user: User = { id: '1', email: 'test@example.com', name: 'Test User', createdAt: new Date(), updatedAt: new Date() };

  describe('listUsers', () => {
    test('should return a list of users', async () => {
      (mockUserRepository.findAll as Mock<any>).mockResolvedValue([user]);
      const users = await userService.listUsers();
      expect(users).toEqual([user]);
      expect(mockUserRepository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('getUserById', () => {
    test('should return a user when found', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(user);
      const foundUser = await userService.getUserById('1');
      expect(foundUser).toEqual(user);
      expect(mockUserRepository.findById).toHaveBeenCalledWith('1');
    });

    test('should throw UserNotFoundError when user is not found', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(null);
      await expect(userService.getUserById('2')).rejects.toThrow(UserNotFoundError);
    });
  });

  describe('registerUser', () => {
    const createInput: CreateUserInput = { email: 'new@example.com', name: 'New User' };

    test('should create and return a new user', async () => {
      (mockUserRepository.findByEmail as Mock<any>).mockResolvedValue(null);
      (mockUserRepository.create as Mock<any>).mockResolvedValue({ ...user, ...createInput });

      const newUser = await userService.registerUser(createInput);

      expect(newUser.email).toBe(createInput.email);
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(createInput.email);
      expect(mockUserRepository.create).toHaveBeenCalled();
    });

    test('should throw UserAlreadyExistsError if email is taken', async () => {
      (mockUserRepository.findByEmail as Mock<any>).mockResolvedValue(user);
      await expect(userService.registerUser(createInput)).rejects.toThrow(UserAlreadyExistsError);
    });
  });

  describe('updateUserProfile', () => {
    const updateInput: UpdateUserInput = { name: 'Updated Name' };

    test('should update and return the user profile', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(user);
      (mockUserRepository.update as Mock<any>).mockResolvedValue({ ...user, ...updateInput });

      const updatedUser = await userService.updateUserProfile('1', updateInput);

      expect(updatedUser.name).toBe(updateInput.name!);
      expect(mockUserRepository.update).toHaveBeenCalledWith('1', expect.any(Object));
    });

    test('should throw UserNotFoundError if user to update is not found', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(null);
      await expect(userService.updateUserProfile('2', updateInput)).rejects.toThrow(UserNotFoundError);
    });

    test('should throw UserAlreadyExistsError if new email is taken by another user', async () => {
      const anotherUser = { ...user, id: '2', email: 'another@example.com' };
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(user);
      (mockUserRepository.findByEmail as Mock<any>).mockResolvedValue(anotherUser);

      const emailUpdate: UpdateUserInput = { email: 'another@example.com' };
      await expect(userService.updateUserProfile('1', emailUpdate)).rejects.toThrow(UserAlreadyExistsError);
    });

    // test('should not throw an error if new email is the same as the current user\'s', async () => {
    //     (mockUserRepository.findById as Mock<any>).mockResolvedValue({...user, id: '1'});
    //     (mockUserRepository.findByEmail as Mock<any>).mockResolvedValue({...user, id: '1'}); // The conflicting user is the same user
  
    //     const emailUpdate: UpdateUserInput = { email: user.email };
    //     await expect(userService.updateUserProfile('1', emailUpdate)).resolves.not.toThrow();
    //     expect(mockUserRepository.update).toHaveBeenCalled();
    //   });
    
  });

  describe('deleteUser', () => {
    test('should delete the user', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(user);
      (mockUserRepository.delete as Mock<any>).mockResolvedValue(undefined);

      await userService.deleteUser('1');

      expect(mockUserRepository.delete).toHaveBeenCalledWith('1');
    });

    test('should throw UserNotFoundError if user to delete is not found', async () => {
      (mockUserRepository.findById as Mock<any>).mockResolvedValue(null);
      await expect(userService.deleteUser('2')).rejects.toThrow(UserNotFoundError);
    });
  });
});