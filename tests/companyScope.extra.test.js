import { getCompanyIdForUser, getCompanyIdForCreate } from '../src/utils/companyScope.js';
import { Role } from '../src/constants/roles.js';
import AppError from '../src/utils/AppError.js';

describe('companyScope additional edge cases', () => {
  test('getCompanyIdForUser accepts numeric companyId', () => {
    const user = { role: Role.FLEET_MANAGER, companyId: 4 };
    expect(getCompanyIdForUser(user)).toBe(4);
  });

  test('getCompanyIdForUser throws for companyId 0', () => {
    const user = { role: Role.FLEET_MANAGER, companyId: 0 };
    expect(() => getCompanyIdForUser(user)).toThrow(AppError);
  });

  test('getCompanyIdForUser throws for negative companyId', () => {
    const user = { role: Role.FLEET_MANAGER, companyId: -2 };
    expect(() => getCompanyIdForUser(user)).toThrow(AppError);
  });

  test('getCompanyIdForUser throws for decimal companyId', () => {
    const user = { role: Role.FLEET_MANAGER, companyId: '3.5' };
    expect(() => getCompanyIdForUser(user)).toThrow(AppError);
  });

  test('getCompanyIdForCreate for ADMIN accepts numeric requestedCompanyId', () => {
    const user = { role: Role.ADMIN };
    expect(getCompanyIdForCreate(user, 12)).toBe(12);
  });

  test('getCompanyIdForCreate for ADMIN rejects non-integer requestedCompanyId', () => {
    const user = { role: Role.ADMIN };
    expect(() => getCompanyIdForCreate(user, '3.2')).toThrow(AppError);
  });

  test('getCompanyIdForCreate for non-ADMIN returns user company regardless of requestedCompanyId', () => {
    const user = { role: Role.CAPTAIN, companyId: '9' };
    expect(getCompanyIdForCreate(user, '100')).toBe(9);
  });
});
