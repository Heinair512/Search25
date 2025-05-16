import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithPlugins } from '../utils';
import SideMenu from '../../components/SideMenu.vue';
import { useRouter } from 'vue-router';
import { vi } from 'vitest';

vi.mock('vue-router', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn()
  })),
  useRoute: vi.fn(() => ({ path: '/' }))
}));

describe('SideMenu', () => {
  let router;

  beforeEach(() => {
    router = { push: vi.fn() };
    useRouter.mockImplementation(() => router);
  });

  it('renders all menu sections', () => {
    const { getByText } = renderWithPlugins(SideMenu);

    expect(getByText('Search Preview')).toBeTruthy();
    expect(getByText('Search Management')).toBeTruthy();
    expect(getByText('Analytics')).toBeTruthy();
  });

  it('collapses and expands', async () => {
    const { container } = renderWithPlugins(SideMenu);

    const toggleButton = container.querySelector('.toggle-button');
    expect(toggleButton).toBeTruthy();

    await toggleButton.click();
    expect(container.querySelector('.collapsed')).toBeTruthy();

    await toggleButton.click();
    expect(container.querySelector('.collapsed')).toBeFalsy();
  });

  it('highlights active menu item', async () => {
    vi.mocked(useRouter).mockImplementation(() => ({
      push: vi.fn(),
      currentRoute: { value: { path: '/dashboard/analytics' } }
    }));

    const { container } = renderWithPlugins(SideMenu);
    const activeItem = container.querySelector('.p-highlight');
    expect(activeItem).toBeTruthy();
  });

  it('navigates to correct routes on menu item click', async () => {
    const { getByText } = renderWithPlugins(SideMenu);
    
    await getByText('Analytics Dashboard').click();
    expect(router.push).toHaveBeenCalledWith('/dashboard/analytics');

    await getByText('Zero Result Searches').click();
    expect(router.push).toHaveBeenCalledWith('/dashboard/analytics/no-results');
  });
});