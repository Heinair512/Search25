import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithPlugins } from '../utils';
import Login from '../../screens/Login.vue';

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders login form', () => {
    const { getByLabelText, getByText } = renderWithPlugins(Login);

    expect(getByLabelText('Email')).toBeTruthy();
    expect(getByLabelText('Password')).toBeTruthy();
    expect(getByText('Sign in')).toBeTruthy();
  });

  it('shows validation errors for empty fields', async () => {
    const { getByText, getByRole } = renderWithPlugins(Login);

    const submitButton = getByRole('button', { name: /sign in/i });
    await submitButton.click();

    expect(getByText('Email is required')).toBeTruthy();
    expect(getByText('Password is required')).toBeTruthy();
  });

  it('handles successful login', async () => {
    const { getByLabelText, getByRole } = renderWithPlugins(Login);

    const emailInput = getByLabelText('Email');
    const passwordInput = getByLabelText('Password');
    const submitButton = getByRole('button', { name: /sign in/i });

    await emailInput.setValue('Joerg.Wehrenberg@gc-gruppe.de');
    await passwordInput.setValue('12345');
    await submitButton.click();

    expect(localStorage.getItem('currentUser')).toBeTruthy();
  });
});