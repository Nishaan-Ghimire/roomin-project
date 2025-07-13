import { UserAnalytics, ActivityLog } from '../models/analytics.model.js';
import {AnalyticsService} from '../functions/analytics.service.js';


export class AdminAnalyticsController {
  
  // 📈 Get overall platform analytics
  static async getPlatformAnalytics(req, res) {
    try {
      const { startDate, endDate, limit = 100 } = req.query;
      
      // Date range filter
      const dateFilter = {};
      if (startDate || endDate) {
        dateFilter.createdAt = {};
        if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
        if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
      }

      // Aggregate platform stats
      const platformStats = await UserAnalytics.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: null,
            totalUsers: { $sum: 1 },
            totalLogins: { $sum: '$loginCount' },
            totalSessions: { $sum: '$totalSessions' },
            totalTimeSpent: { $sum: '$totalTimeSpent' },
            avgLoginsPerUser: { $avg: '$loginCount' },
            avgSessionsPerUser: { $avg: '$totalSessions' },
            avgTimePerUser: { $avg: '$totalTimeSpent' }
          }
        }
      ]);

      // Most active users
      const topUsers = await UserAnalytics.find(dateFilter)
        .sort({ loginCount: -1 })
        .limit(parseInt(limit))
        .populate('userId', 'username email');

      // Browser/OS stats
      const browserStats = await UserAnalytics.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$deviceInfo.browser', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      const osStats = await UserAnalytics.aggregate([
        { $match: dateFilter },
        { $group: { _id: '$deviceInfo.os', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
      ]);

      // Recent activity
      const recentActivity = await ActivityLog.find(dateFilter)
        .sort({ timestamp: -1 })
        .limit(50)
        .populate('userId', 'username email');

      res.json({
        success: true,
        data: {
          platformStats: platformStats[0] || {},
          topUsers,
          browserStats,
          osStats,
          recentActivity
        }
      });

    } catch (error) {
      console.error('Error getting platform analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch platform analytics',
        error: error.message
      });
    }
  }

  // 👤 Get specific user analytics
  static async getUserAnalytics(req, res) {
    try {
      const { userId } = req.params;
      
      const userAnalytics = await AnalyticsService.getUserAnalytics(userId);
      
      if (!userAnalytics.analytics) {
        return res.status(404).json({
          success: false,
          message: 'User analytics not found'
        });
      }

      res.json({
        success: true,
        data: userAnalytics
      });

    } catch (error) {
      console.error('Error getting user analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch user analytics',
        error: error.message
      });
    }
  }

  // 📊 Get login analytics
  static async getLoginAnalytics(req, res) {
    try {
      const { period = '7d' } = req.query;
      
      // Calculate date range based on period
      const endDate = new Date();
      const startDate = new Date();
      
      switch (period) {
        case '24h':
          startDate.setHours(startDate.getHours() - 24);
          break;
        case '7d':
          startDate.setDate(startDate.getDate() - 7);
          break;
        case '30d':
          startDate.setDate(startDate.getDate() - 30);
          break;
        case '90d':
          startDate.setDate(startDate.getDate() - 90);
          break;
        default:
          startDate.setDate(startDate.getDate() - 7);
      }

      // Daily login counts
      const dailyLogins = await ActivityLog.aggregate([
        {
          $match: {
            action: 'login',
            timestamp: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: {
              year: { $year: '$timestamp' },
              month: { $month: '$timestamp' },
              day: { $dayOfMonth: '$timestamp' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]);

      // Login frequency distribution
      const loginFrequency = await UserAnalytics.aggregate([
        {
          $bucket: {
            groupBy: '$loginCount',
            boundaries: [0, 1, 5, 10, 25, 50, 100],
            default: '100+',
            output: { count: { $sum: 1 } }
          }
        }
      ]);

      res.json({
        success: true,
        data: {
          period,
          dailyLogins,
          loginFrequency
        }
      });

    } catch (error) {
      console.error('Error getting login analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch login analytics',
        error: error.message
      });
    }
  }

  // 🔥 Get most used features
  static async getFeatureAnalytics(req, res) {
    try {
      const featureUsage = await UserAnalytics.aggregate([
        { $unwind: '$featuresUsed' },
        {
          $group: {
            _id: '$featuresUsed.featureName',
            totalUsage: { $sum: '$featuresUsed.count' },
            uniqueUsers: { $sum: 1 },
            lastUsed: { $max: '$featuresUsed.lastUsed' }
          }
        },
        { $sort: { totalUsage: -1 } },
        { $limit: 20 }
      ]);

      res.json({
        success: true,
        data: featureUsage
      });

    } catch (error) {
      console.error('Error getting feature analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch feature analytics',
        error: error.message
      });
    }
  }

  // 🌍 Get page view analytics
  static async getPageAnalytics(req, res) {
    try {
      const pageViews = await UserAnalytics.aggregate([
        { $unwind: '$pageViews' },
        {
          $group: {
            _id: '$pageViews.route',
            totalViews: { $sum: '$pageViews.count' },
            uniqueUsers: { $sum: 1 },
            lastVisited: { $max: '$pageViews.lastVisited' }
          }
        },
        { $sort: { totalViews: -1 } },
        { $limit: 20 }
      ]);

      res.json({
        success: true,
        data: pageViews
      });

    } catch (error) {
      console.error('Error getting page analytics:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch page analytics',
        error: error.message
      });
    }
  }

  // 🗑️ Clean old activity logs (for maintenance)
  static async cleanOldLogs(req, res) {
    try {
      const { days = 90 } = req.query;
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));

      const result = await ActivityLog.deleteMany({
        timestamp: { $lt: cutoffDate }
      });

      res.json({
        success: true,
        message: `Cleaned ${result.deletedCount} old activity logs`,
        deletedCount: result.deletedCount
      });

    } catch (error) {
      console.error('Error cleaning old logs:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to clean old logs',
        error: error.message
      });
    }
  }
}

