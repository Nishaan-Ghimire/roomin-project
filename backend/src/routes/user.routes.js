import {
    Router
} from 'express'
import { trackPageView, trackFeatureUsage } from "../middlewares/analytics.middleware.js"
import {
    registerUser,
    loginUser,
    getMyProfile,
    updateProfile,
    sendBookingRequest,
    changePassword,
    topUpWallet,
    getWalletBalance,
    checkBookingStatus,
    searchProperties,
    getUserById,
    getAcceptedBookings,
    rateProperty,
    getPropertiesByIds
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js'
import { getAllProperties } from '../controllers/user.controller.js';
import {
  createAccountOtp,
  forgotPasswordOtp,
  verifyOtp,
  resetPassword
} from '../controllers/auth.controller.js';
import {
  getMessages,
  setMessage,
  getChatUsers
} from '../controllers/message.controller.js';



const router = Router();

router.route('/register').post(registerUser);
router.route('/login').post(loginUser);
router.get('/getAllProperties', trackPageView, getAllProperties);
router.post('/booking-requests', authMiddleware, trackFeatureUsage("Booking Requests"), sendBookingRequest);
router.get('/bookings/status', authMiddleware, checkBookingStatus);
router.post('/top-up-wallet', authMiddleware, topUpWallet);
router.get('/checkwallet', authMiddleware, getWalletBalance);
router.get('/me', authMiddleware, getMyProfile);
router.post('/getPropertiesByIds', getPropertiesByIds)
router.route('/updateAccountDetail').patch(authMiddleware, updateProfile);
router.patch('/change-password', authMiddleware, changePassword);
router.get('/getUserById/:id', getUserById)
router.get('/accepted-bookings', authMiddleware, trackFeatureUsage("Accepted Booking"), getAcceptedBookings);
router.post('/rate-property/:propertyId', authMiddleware, rateProperty);


router.post('/acreateAccount-request-otp', createAccountOtp);
router.post('/request-otp', forgotPasswordOtp);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Messaging Routes
router.get('/messages/:userId1/:userId2', getMessages);
router.post('/setMessage', setMessage);
router.get('/chat/chat-users/:userId', getChatUsers);


// Searching Routes
router.get('/search', authMiddleware, trackFeatureUsage("Properties Searches"), searchProperties)
export default router;



