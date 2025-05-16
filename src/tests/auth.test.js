import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useAuthStore } from '../store/modules/auth';

describe('Auth Store', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should handle successful login', async () => {
    const users = [
      { email: 'test@example.com', password: 'password123' }
    ];
    localStorage.setItem('users', JSON.stringify(users));

    const auth = useAuthStore();
    await auth.login('test@example.com', 'password123');

    expect(auth.isAuthenticated.value).toBe(true);
    expect(auth.currentUser.value).toBeTruthy();

    const sessionData = JSON.parse(localStorage.getItem('currentUser'));
    expect(sessionData.user).toBeTruthy();
    expect(sessionData.expiry).toBeGreaterThan(Date.now());
  });

  it('should handle failed login', async () => {
    const auth = useAuthStore();
    
    await expect(auth.login('wrong@example.com', 'wrongpass'))
      .rejects.toThrow('Invalid credentials');
    
    expect(auth.isAuthenticated.value).toBe(false);
    expect(auth.currentUser.value).toBeNull();
  });

  it('should handle logout', () => {
    const auth = useAuthStore();
    localStorage.setItem('currentUser', JSON.stringify({
      user: { email: 'test@example.com' },
      expiry: Date.now() + 1000
    }));

    auth.logout();

    expect(auth.isAuthenticated.value).toBe(false);
    expect(auth.currentUser.value).toBeNull();
    expect(localStorage.getItem('currentUser')).toBeNull();
  });

  it('should handle session timeout', () => {
    const auth = useAuthStore();
    const sessionData = {
      user: { email: 'test@example.com' },
      expiry: Date.now() + 1000
    };
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
    auth.initializeAuth();

    vi.advanceTimersByTime(1001);

    expect(auth.isAuthenticated.value).toBe(false);
    expect(auth.currentUser.value).toBeNull();
  });

  it('should maintain session within expiry', () => {
    const auth = useAuthStore();
    const sessionData = {
      user: { email: 'test@example.com' },
      expiry: Date.now() + 1000
    };
    localStorage.setItem('currentUser', JSON.stringify(sessionData));
    auth.initializeAuth();

    vi.advanceTimersByTime(500);

    expect(auth.isAuthenticated.value).toBe(true);
    expect(auth.currentUser.value).toBeTruthy();
  });
});