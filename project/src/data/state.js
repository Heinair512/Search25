// State management for the application
const STATE_KEY = 'app_state_snapshot';

export const saveCurrentState = () => {
  const state = {
    users: localStorage.getItem('users'),
    currentUser: localStorage.getItem('currentUser'),
    theme: localStorage.getItem('theme'),
    language: localStorage.getItem('language'),
    timestamp: new Date().toISOString()
  };
  
  localStorage.setItem(STATE_KEY, JSON.stringify(state));
  return state;
};

export const restoreState = () => {
  const savedState = localStorage.getItem(STATE_KEY);
  if (!savedState) {
    return false;
  }

  const state = JSON.parse(savedState);
  
  if (state.users) localStorage.setItem('users', state.users);
  if (state.currentUser) localStorage.setItem('currentUser', state.currentUser);
  if (state.theme) localStorage.setItem('theme', state.theme);
  if (state.language) localStorage.setItem('language', state.language);
  
  return true;
};