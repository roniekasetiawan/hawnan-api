import { describe, test, expect, vi, beforeEach } from 'bun:test';
import { UserRepository } from './user.repository';
import { PrismaClient } from '@/generated/prisma';
import { UserDomainProps } from './user.domain';

// Mock PrismaClient
const mockPrismaClient = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
} as unknown as PrismaClient;

describe('UserRepository', () => {
  let userRepository: UserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    userRepository = new UserRepository({ db: mockPrismaClient });
  });

  test('findAll should call findMany with correct parameters', async () => {
    await userRepository.findAll();
    expect(mockPrismaClient.user.findMany).toHaveBeenCalledWith({
      orderBy: { createdAt: 'desc' },
    });
  });

  test('findById should call findUnique with correct id', async () => {
    const id = 'test-id';
    await userRepository.findById(id);
    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({ where: { id } });
  });

  test('findByEmail should call findUnique with correct email', async () => {
    const email = 'test@example.com';
    await userRepository.findByEmail(email);
    expect(mockPrismaClient.user.findUnique).toHaveBeenCalledWith({ where: { email } });
  });

  test('create should call create with correct data', async () => {
    const userData: UserDomainProps = { email: 'new@example.com', name: 'New User' };
    await userRepository.create(userData);
    expect(mockPrismaClient.user.create).toHaveBeenCalledWith({ data: userData });
  });

  test('update should call update with correct id and data', async () => {
    const id = 'test-id';
    const dataToUpdate = { name: 'Updated Name' };
    await userRepository.update(id, dataToUpdate);
    expect(mockPrismaClient.user.update).toHaveBeenCalledWith({ where: { id }, data: dataToUpdate });
  });

  test('delete should call delete with correct id', async () => {
    const id = 'test-id';
    await userRepository.delete(id);
    expect(mockPrismaClient.user.delete).toHaveBeenCalledWith({ where: { id } });
  });

  test('withTx should return a new UserRepository instance with the transaction client', () => {
    const mockTxClient = { user: { findUnique: vi.fn() } } as unknown as PrismaClient;
    const txUserRepository = userRepository.withTx({ tx: mockTxClient });

    expect(txUserRepository).toBeInstanceOf(UserRepository);
    expect(txUserRepository).not.toBe(userRepository);

    // To verify it's using the new client, we can check if a method call on the new repo instance
    // calls the mockTxClient instead of the original mockPrismaClient.
    txUserRepository.findById('some-id');
    expect(mockTxClient.user.findUnique).toHaveBeenCalled();
    expect(mockPrismaClient.user.findUnique).not.toHaveBeenCalled();
  });
});