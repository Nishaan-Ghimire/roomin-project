import {Router} from 'express'
import {AdminAnalyticsController} from "../controllers/admin.controller.js"

const router = Router();

router.get('/analytics/platform', AdminAnalyticsController.getPlatformAnalytics);
router.get('/analytics/user/:userId', AdminAnalyticsController.getUserAnalytics);
router.get('/analytics/logins', AdminAnalyticsController.getLoginAnalytics);
router.get('/analytics/features', AdminAnalyticsController.getFeatureAnalytics);
router.get('/analytics/pages', AdminAnalyticsController.getPageAnalytics);
router.delete('/analytics/clean', AdminAnalyticsController.cleanOldLogs);


export default router;