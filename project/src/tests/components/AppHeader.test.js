import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithPlugins } from '../utils';
import AppHeader from '../../components/AppHeader.vue';

describe('AppHeader', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly with user data', async () => {
    const props = {
      userRole: 'Admin',
      userBUs: ['GC Gruppe', 'Search']
    };

    const { getByText } = renderWithPlugins(AppHeader, {
      props
    });

    expect(getByText('Business Unit')).toBeTruthy();
  });

  it('handles theme toggle', async () => {
    const props = {
      userRole: 'Admin',
      userBUs: ['GC Gruppe']
    };

    const { container } = renderWithPlugins(AppHeader, {
      props
    });

    const themeButton = container.querySelector('.pi-moon') || container.querySelector('.pi-sun');
    expect(themeButton).toBeTruthy();
  });

  it('handles language switch', async () => {
    const props = {
      userRole: 'Admin',
      userBUs: ['GC Gruppe']
    };

    const { getByText } = renderWithPlugins(AppHeader, {
      props
    });

    expect(getByText('DE')).toBeTruthy();
    expect(getByText('EN')).toBeTruthy();
  });
});