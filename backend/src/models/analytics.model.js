import mongoose from 'mongoose';

// Main User Analytics Schema
const userAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Login tracking
  loginCount: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  
  // Activity tracking
  totalSessions: {
    type: Number,
    default: 0
  },
  totalTimeSpent: {
    type: Number, // in minutes
    default: 0
  },
  
  // Feature usage
  featuresUsed: [{
    featureName: String,
    count: Number,
    lastUsed: Date
  }],
  
  // Page/Route analytics
  pageViews: [{
    route: String,
    count: Number,
    lastVisited: Date
  }],
  
  // Device & location info
  deviceInfo: {
    browser: String,
    os: String,
    deviceType: String // mobile, desktop, tablet
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Activity Log Schema for detailed tracking
const activityLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  action: {
    type: String,
    required: true,
    enum: ['login', 'logout', 'page_view', 'feature_use', 'api_call', 'error']
  },
  
  details: {
    route: String,
    method: String,
    statusCode: Number,
    featureName: String,
    errorMessage: String,
    additionalData: mongoose.Schema.Types.Mixed
  },
  
  ipAddress: String,
  userAgent: String,
  
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better performance
userAnalyticsSchema.index({ userId: 1 });
userAnalyticsSchema.index({ lastLogin: -1 });
activityLogSchema.index({ userId: 1, timestamp: -1 });
activityLogSchema.index({ action: 1, timestamp: -1 });

// Update the updatedAt field on save
userAnalyticsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserAnalytics = mongoose.model('UserAnalytics', userAnalyticsSchema);
const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export { UserAnalytics, ActivityLog };