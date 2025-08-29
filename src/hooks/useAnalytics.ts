import { useCallback } from 'react';

type EventType = 'coi_upload' | 'po_block' | 'compliance_check' | 'user_action' | 'error' | string;

interface AnalyticsEvent {
  event_type: EventType;
  data: Record<string, any>;
  metadata?: Record<string, any>;
}

interface UseAnalyticsReturn {
  trackEvent: (event: AnalyticsEvent) => Promise<boolean>;
  trackCOIUpload: (data: {
    vendor_industry: string;
    coverage_amounts: Record<string, number>;
    carrier: string;
    premium?: number;
    months_until_expiry: number;
  }) => Promise<boolean>;
  trackPOBlock: (data: {
    amount_blocked: number;
    vendor_id: string;
    reason: string;
  }) => Promise<boolean>;
  trackComplianceCheck: (data: {
    coverage_gap: number;
    industry: string;
    percentile: number;
  }) => Promise<boolean>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const trackEvent = useCallback(async (event: AnalyticsEvent): Promise<boolean> => {
    try {
      const response = await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          metadata: {
            ...event.metadata,
            page: window.location.pathname,
            referrer: document.referrer,
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            timestamp: new Date().toISOString(),
          },
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to track event:', await response.text());
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error tracking event:', error);
      return false;
    }
  }, []);

  const trackCOIUpload = useCallback((data: {
    vendor_industry: string;
    coverage_amounts: Record<string, number>;
    carrier: string;
    premium?: number;
    months_until_expiry: number;
  }) => {
    return trackEvent({
      event_type: 'coi_upload',
      data,
    });
  }, [trackEvent]);

  const trackPOBlock = useCallback((data: {
    amount_blocked: number;
    vendor_id: string;
    reason: string;
  }) => {
    return trackEvent({
      event_type: 'po_block',
      data: {
        ...data,
        risk_avoided: data.amount_blocked * 0.1, // 10% risk assumption
      },
    });
  }, [trackEvent]);

  const trackComplianceCheck = useCallback((data: {
    coverage_gap: number;
    industry: string;
    percentile: number;
  }) => {
    return trackEvent({
      event_type: 'compliance_check',
      data,
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackCOIUpload,
    trackPOBlock,
    trackComplianceCheck,
  };
}

// Example usage:
/*
const { trackEvent, trackCOIUpload } = useAnalytics();

// Track a custom event
trackEvent({
  event_type: 'user_action',
  data: { action: 'click_button', button_id: 'upgrade_now' },
});

// Track a COI upload
trackCOIUpload({
  vendor_industry: 'construction',
  coverage_amounts: { general_liability: 2000000 },
  carrier: 'Acme Insurance',
  premium: 5000,
  months_until_expiry: 6,
});
*/
