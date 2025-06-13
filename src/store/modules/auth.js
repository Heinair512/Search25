import { reactive, computed } from 'vue';
import { mailServer } from '../../utils/mailServer';
import { users as initialUsers } from '../../data/users';

const state = reactive({
  currentUser: null,
  loading: false,
  error: null
});

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

      state.currentUser = user;
      localStorage.setItem('currentUser', JSON.stringify(user));
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

  const initializeAuth = () => {
    // Load current user from localStorage if available
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      state.currentUser = JSON.parse(savedUser);
    }

    // Check if users are already in localStorage
    const savedUsers = localStorage.getItem('users');
    if (!savedUsers) {
      // If not, initialize with the default users from data/users.js
      localStorage.setItem('users', JSON.stringify(initialUsers));
      console.log('Initialized users in localStorage');
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
    initializeAuth
  };
};