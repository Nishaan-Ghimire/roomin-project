import { UserAnalytics, ActivityLog } from '../models/analytics.model.js';


export class AnalyticsService {
  
  // 🚀 Track user login (call this in your login route)
  static async trackLogin(userId, req) {
    try {
      // Update or create user analytics
      const analytics = await UserAnalytics.findOneAndUpdate(
        { userId },
        {
          $inc: { loginCount: 1, totalSessions: 1 },
          $set: { 
            lastLogin: new Date(),
            'deviceInfo.browser': this.getBrowser(req.headers['user-agent']),
            'deviceInfo.os': this.getOS(req.headers['user-agent']),
            'deviceInfo.deviceType': this.getDeviceType(req.headers['user-agent'])
          }
        },
        { upsert: true, new: true }
      );

      // Log the activity
      await ActivityLog.create({
        userId,
        action: 'login',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: {
          loginCount: analytics.loginCount
        }
      });

      return analytics;
    } catch (error) {
      console.error('Error tracking login:', error);
      throw error;
    }
  }

  // 📱 Track page views
  static async trackPageView(userId, route, req) {
    try {
      // Update page view count
      await UserAnalytics.findOneAndUpdate(
        { userId, 'pageViews.route': route },
        {
          $inc: { 'pageViews.$.count': 1 },
          $set: { 'pageViews.$.lastVisited': new Date() }
        }
      );

      // If route doesn't exist, add it
      const result = await UserAnalytics.findOneAndUpdate(
        { 
          userId, 
          'pageViews.route': { $ne: route }
        },
        {
          $push: {
            pageViews: {
              route,
              count: 1,
              lastVisited: new Date()
            }
          }
        }
      );

      // Log the activity
      await ActivityLog.create({
        userId,
        action: 'page_view',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { route }
      });

    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  // ⚡ Track feature usage
  static async trackFeatureUsage(userId, featureName, req) {
    try {
      // Update feature usage count
      await UserAnalytics.findOneAndUpdate(
        { userId, 'featuresUsed.featureName': featureName },
        {
          $inc: { 'featuresUsed.$.count': 1 },
          $set: { 'featuresUsed.$.lastUsed': new Date() }
        }
      );

      // If feature doesn't exist, add it
      await UserAnalytics.findOneAndUpdate(
        { 
          userId, 
          'featuresUsed.featureName': { $ne: featureName }
        },
        {
          $push: {
            featuresUsed: {
              featureName,
              count: 1,
              lastUsed: new Date()
            }
          }
        }
      );

      // Log the activity
      await ActivityLog.create({
        userId,
        action: 'feature_use',
        ipAddress: req.ip,
        userAgent: req.headers['user-agent'],
        details: { featureName }
      });

    } catch (error) {
      console.error('Error tracking feature usage:', error);
    }
  }

  // 🕐 Track session time
  static async trackSessionTime(userId, sessionDuration) {
    try {
      await UserAnalytics.findOneAndUpdate(
        { userId },
        {
          $inc: { totalTimeSpent: sessionDuration }
        }
      );
    } catch (error) {
      console.error('Error tracking session time:', error);
    }
  }

  // 🔍 Helper methods for device detection
  static getBrowser(userAgent) {
    if (!userAgent) return 'unknown';
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Other';
  }

  static getOS(userAgent) {
    if (!userAgent) return 'unknown';
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac')) return 'MacOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    return 'Other';
  }

  static getDeviceType(userAgent) {
    if (!userAgent) return 'unknown';
    
    if (userAgent.includes('Mobile')) return 'mobile';
    if (userAgent.includes('Tablet')) return 'tablet';
    return 'desktop';
  }

  // 📊 Get user analytics summary
  static async getUserAnalytics(userId) {
    try {
      const analytics = await UserAnalytics.findOne({ userId });
      const recentActivity = await ActivityLog.find({ userId })
        .sort({ timestamp: -1 })
        .limit(20);
      
      return {
        analytics,
        recentActivity
      };
    } catch (error) {
      console.error('Error getting user analytics:', error);
      throw error;
    }
  }
}

