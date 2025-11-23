import React from 'react';
import { render } from '@/__tests__/utils/test-utils';
import { WebVitalsReporter } from '../web-vitals-reporter';
import * as webVitals from 'web-vitals';
import { createClient } from '../../../../supabase/client';

// Mock web-vitals library
jest.mock('web-vitals', () => ({
  onCLS: jest.fn(),
  onFID: jest.fn(),
  onLCP: jest.fn(),
  onFCP: jest.fn(),
  onTTFB: jest.fn(),
  onINP: jest.fn(),
}));

// Mock Supabase client
jest.mock('../../../../supabase/client', () => ({
  createClient: jest.fn(),
}));

// Mock console methods
const originalConsoleLog = console.log;
const originalConsoleError = console.error;

describe('WebVitalsReporter', () => {
  let mockSupabase: any;
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Mock console
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    // Mock Supabase client
    mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { id: 'test-user-id' } },
        }),
        onAuthStateChange: jest.fn(),
      },
      from: jest.fn().mockReturnValue({
        insert: jest.fn().mockResolvedValue({ error: null }),
      }),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);

    // Mock sessionStorage
    const sessionStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: sessionStorageMock,
      writable: true,
    });
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  afterAll(() => {
    console.log = originalConsoleLog;
    console.error = originalConsoleError;
  });

  it('renders without crashing', () => {
    const { container } = render(<WebVitalsReporter />);
    expect(container).toBeInTheDocument();
  });

  it('does not render any visible UI', () => {
    const { container } = render(<WebVitalsReporter />);
    // The component should not render any DOM nodes (returns null)
    // Note: container may have other elements from test setup (like theme scripts)
    const componentElements = container.querySelectorAll('[data-testid], div, span, p, button');
    expect(componentElements.length).toBe(0);
  });

  it('registers all web vitals observers on mount', () => {
    render(<WebVitalsReporter />);

    expect(webVitals.onLCP).toHaveBeenCalledTimes(1);
    expect(webVitals.onFID).toHaveBeenCalledTimes(1);
    expect(webVitals.onCLS).toHaveBeenCalledTimes(1);
    expect(webVitals.onFCP).toHaveBeenCalledTimes(1);
    expect(webVitals.onTTFB).toHaveBeenCalledTimes(1);
    expect(webVitals.onINP).toHaveBeenCalledTimes(1);
  });

  it('calls web vitals observers with a callback function', () => {
    render(<WebVitalsReporter />);

    expect(webVitals.onLCP).toHaveBeenCalledWith(expect.any(Function));
    expect(webVitals.onFID).toHaveBeenCalledWith(expect.any(Function));
    expect(webVitals.onCLS).toHaveBeenCalledWith(expect.any(Function));
  });

  describe('Development Mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('logs metrics to console in development mode', async () => {
      render(<WebVitalsReporter />);

      // Get the callback that was passed to onLCP
      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      // Simulate LCP metric
      const mockMetric = {
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      };

      lcpCallback(mockMetric);

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Web Vitals] LCP: 2000ms (good)'),
        expect.any(String),
        expect.objectContaining({
          id: 'v1-lcp-123',
          navigationType: 'navigate',
          rating: 'good',
        })
      );
    });

    it('logs with correct rating colors in development', async () => {
      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      // Test "good" rating (LCP < 2500ms)
      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-good',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('(good)'),
        'color: #0cce6b; font-weight: bold',
        expect.any(Object)
      );
    });

    it('does not send metrics to Supabase in development mode', async () => {
      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(mockSupabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Production Mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('sends metrics to Supabase in production mode', async () => {
      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      // Mock navigator.userAgent
      Object.defineProperty(window.navigator, 'userAgent', {
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        writable: true,
      });

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      // Wait for async operations
      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(mockSupabase.from).toHaveBeenCalledWith('web_vitals_logs');
      expect(mockSupabase.from().insert).toHaveBeenCalledWith(
        expect.objectContaining({
          metric_name: 'LCP',
          metric_value: 2000,
          metric_rating: 'good',
          page_url: expect.any(String),
          user_agent: expect.any(String),
        })
      );
    });

    it('does not log to console in production mode', async () => {
      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not log the metric (only errors if any)
      expect(consoleLogSpy).not.toHaveBeenCalledWith(
        expect.stringContaining('[Web Vitals] LCP'),
        expect.any(String),
        expect.any(Object)
      );
    });

    it('handles Supabase insertion errors gracefully', async () => {
      // Mock Supabase error
      mockSupabase.from.mockReturnValue({
        insert: jest.fn().mockResolvedValue({
          error: { message: 'Database error' },
        }),
      });

      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 100));

      expect(consoleErrorSpy).toHaveBeenCalledWith(
        '[Web Vitals] Failed to log metric:',
        expect.objectContaining({ message: 'Database error' })
      );
    });
  });

  describe('Metric Ratings', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('correctly rates LCP as "good" when < 2500ms', async () => {
      render(<WebVitalsReporter />);
      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-good',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('(good)'),
        expect.any(String),
        expect.objectContaining({ rating: 'good' })
      );
    });

    it('correctly rates LCP as "needs-improvement" when between 2500-4000ms', async () => {
      render(<WebVitalsReporter />);
      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 3000,
        id: 'v1-lcp-needs-improvement',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('(needs-improvement)'),
        expect.any(String),
        expect.objectContaining({ rating: 'needs-improvement' })
      );
    });

    it('correctly rates LCP as "poor" when > 4000ms', async () => {
      render(<WebVitalsReporter />);
      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 5000,
        id: 'v1-lcp-poor',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('(poor)'),
        expect.any(String),
        expect.objectContaining({ rating: 'poor' })
      );
    });

    it('correctly rates CLS metrics', async () => {
      render(<WebVitalsReporter />);
      const clsCallback = (webVitals.onCLS as jest.Mock).mock.calls[0][0];

      // Good CLS (< 0.1)
      clsCallback({
        name: 'CLS',
        value: 0.05,
        id: 'v1-cls-good',
        navigationType: 'navigate',
      });

      await new Promise((resolve) => setTimeout(resolve, 0));

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Web Vitals] CLS: 0'),
        expect.any(String),
        expect.objectContaining({ rating: 'good' })
      );
    });
  });

  describe('Session Tracking', () => {
    it('generates and stores a session ID', () => {
      const sessionStorageMock = window.sessionStorage as jest.Mocked<Storage>;
      sessionStorageMock.getItem.mockReturnValue(null);

      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      expect(sessionStorageMock.setItem).toHaveBeenCalledWith(
        'web-vitals-session-id',
        expect.any(String)
      );
    });

    it('reuses existing session ID', () => {
      const sessionStorageMock = window.sessionStorage as jest.Mocked<Storage>;
      sessionStorageMock.getItem.mockReturnValue('existing-session-id');

      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      lcpCallback({
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      });

      expect(sessionStorageMock.setItem).not.toHaveBeenCalled();
    });
  });

  describe('Duplicate Prevention', () => {
    const originalNodeEnv = process.env.NODE_ENV;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    afterEach(() => {
      process.env.NODE_ENV = originalNodeEnv;
    });

    it('prevents duplicate metric reports', async () => {
      render(<WebVitalsReporter />);

      const lcpCallback = (webVitals.onLCP as jest.Mock).mock.calls[0][0];

      const mockMetric = {
        name: 'LCP',
        value: 2000,
        id: 'v1-lcp-123',
        navigationType: 'navigate',
      };

      // Call the callback twice with the same metric
      lcpCallback(mockMetric);
      lcpCallback(mockMetric);

      await new Promise((resolve) => setTimeout(resolve, 0));

      // Should only log once
      expect(consoleLogSpy).toHaveBeenCalledTimes(1);
    });
  });
});
