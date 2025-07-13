import {AnalyticsService} from "../functions/analytics.service.js"


// Page view tracking middleware
export const trackPageView = async (req, res, next) => {
  if (req.user && req.user.userId) {
    // Track page view for authenticated users
    await AnalyticsService.trackPageView(req.user.userId, req.path, req);
  }
  next();
};

// Feature usage tracking middleware
export const trackFeatureUsage = (featureName) => {
  return async (req, res, next) => {
    if (req.user && req.user.userId) {
      await AnalyticsService.trackFeatureUsage(req.user.userId, featureName, req);
    }
    next();
  };
};

