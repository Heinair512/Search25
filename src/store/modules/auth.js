import { reactive, computed } from 'vue';
import { mailServer } from '../../utils/mailServer';

const state = reactive({
  currentUser: null,
  loading: false,
  error: null,
  sessionTimeout: null
});

const SESSION_DURATION = 8 * 60 * 60 * 1000; // 8 hours in milliseconds

export const useAuthStore = () => {
  const login = async (email, password) => {
    state.loading = true;
    state.error = null;

    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);

      if (!user || user.password !== password) {
        throw new Error('Invalid credentials');
      }

      // Set session expiry
      const sessionExpiry = Date.now() + SESSION_DURATION;
      const sessionData = {
        user,
        expiry: sessionExpiry
      };

      state.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
      
      // Set session timeout
      setupSessionTimeout();
      
      return user;
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.loading = false;
    }
  };

  const logout = () => {
    state.currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('advancedMode');
    localStorage.removeItem('language');
    clearTimeout(state.sessionTimeout);
  };

  const resetPassword = async (token, newPassword) => {
    state.loading = true;
    state.error = null;

    try {
      const email = mailServer.verifyResetToken(token);
      if (!email) {
        throw new Error('Invalid or expired token');
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.email === email);
      
      if (user) {
        user.password = newPassword;
        user.needsPasswordReset = false;
        localStorage.setItem('users', JSON.stringify(users));
      }
    } catch (error) {
      state.error = error.message;
      throw error;
    } finally {
      state.loading = false;
    }
  };

  const setupSessionTimeout = () => {
    clearTimeout(state.sessionTimeout);
    
    const sessionData = JSON.parse(localStorage.getItem('currentUser'));
    if (!sessionData) return;

    const timeUntilExpiry = sessionData.expiry - Date.now();
    if (timeUntilExpiry <= 0) {
      logout();
      return;
    }

    state.sessionTimeout = setTimeout(() => {
      logout();
    }, timeUntilExpiry);
  };

  const checkSession = () => {
    const sessionData = JSON.parse(localStorage.getItem('currentUser'));
    if (!sessionData) return false;

    if (Date.now() > sessionData.expiry) {
      logout();
      return false;
    }

    state.currentUser = sessionData.user;
    setupSessionTimeout();
    return true;
  };

  const initializeAuth = () => {
    if (!checkSession()) {
      logout();
    }
  };

  return {
    // State
    currentUser: computed(() => state.currentUser),
    loading: computed(() => state.loading),
    error: computed(() => state.error),
    isAuthenticated: computed(() => !!state.currentUser),

    // Actions
    login,
    logout,
    resetPassword,
    initializeAuth,
    checkSession
  };
};