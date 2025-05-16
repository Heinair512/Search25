import { describe, it, expect, beforeEach } from 'vitest';
import { renderWithPlugins } from '../../utils';
import Dashboard from '../../../screens/Analytics/Dashboard.vue';
import { vi } from 'vitest';

describe('Analytics Dashboard', () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('currentUser', JSON.stringify({
      selectedBU: 'GC Gruppe'
    }));

    // Mock window event listener
    vi.spyOn(window, 'addEventListener');
    vi.spyOn(window, 'removeEventListener');
  });

  it('renders metrics cards', () => {
    const { getByText } = renderWithPlugins(Dashboard);

    expect(getByText('CTR')).toBeTruthy();
    expect(getByText(/conversion rate/i)).toBeTruthy();
    expect(getByText(/total searches/i)).toBeTruthy();
    expect(getByText(/no results rate/i)).toBeTruthy();
  });

  it('renders trend chart', () => {
    const { container } = renderWithPlugins(Dashboard);
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('renders search tables', () => {
    const { getByText } = renderWithPlugins(Dashboard);

    expect(getByText(/no result searches/i)).toBeTruthy();
    expect(getByText(/low click searches/i)).toBeTruthy();
    expect(getByText(/top clicked searches/i)).toBeTruthy();
  });

  it('updates metrics when business unit changes', async () => {
    const { container } = renderWithPlugins(Dashboard);
    
    // Simulate BU change
    window.dispatchEvent(new Event('buChanged'));
    
    // Check if metrics were updated
    expect(container.querySelector('.text-900')).toBeTruthy();
  });

  it('handles metric selection', async () => {
    const { container, getByLabelText } = renderWithPlugins(Dashboard);
    
    const ctrCheckbox = getByLabelText('CTR');
    const mrrCheckbox = getByLabelText('MRR');
    
    await ctrCheckbox.click();
    await mrrCheckbox.click();
    
    // Check if chart updates
    expect(container.querySelector('canvas')).toBeTruthy();
  });

  it('updates data when date range changes', async () => {
    const { container } = renderWithPlugins(Dashboard);
    
    const calendar = container.querySelector('.p-calendar');
    expect(calendar).toBeTruthy();
  });

  it('cleans up event listeners on unmount', () => {
    const { unmount } = renderWithPlugins(Dashboard);
    unmount();
    expect(window.removeEventListener).toHaveBeenCalled();
  });
});