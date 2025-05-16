import { reactive, computed } from 'vue';
import { mailServer } from '../../utils/mailServer';
import { users } from '../../data/users';

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
      const user = users.find(u => u.email === email);

      if (!user || (user.password !== password && user.otp !== password)) {
        throw new Error('Invalid credentials');
      }

      // Handle OTP login
      if (user.otp) {
        if (!user.needsPasswordReset) {
          throw new Error('OTP expired');
        }
        return { requiresPasswordReset: true, user };
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
      
      return { user };
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

  const resetPassword = async (email, newPassword) => {
    state.loading = true;
    state.error = null;

    try {
      const usersList = [...users];
      const userIndex = usersList.findIndex(u => u.email === email);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      const updatedUser = {
        ...usersList[userIndex],
        password: newPassword,
        needsPasswordReset: false
      };
      delete updatedUser.otp;

      usersList[userIndex] = updatedUser;
      localStorage.setItem('users', JSON.stringify(usersList));

      // Set up new session
      const sessionExpiry = Date.now() + SESSION_DURATION;
      const sessionData = {
        user: updatedUser,
        expiry: sessionExpiry
      };

      state.currentUser = updatedUser;
      localStorage.setItem('currentUser', JSON.stringify(sessionData));
      setupSessionTimeout();

      return updatedUser;
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