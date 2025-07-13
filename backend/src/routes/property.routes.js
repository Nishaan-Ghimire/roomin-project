import express from 'express';
import { PropertyController} from '../controllers/property.controller.js';
import  validateProperty from '../middlewares/validate.middleware.js';
import {authMiddleware} from '../middlewares/auth.middleware.js'

const router = express.Router();
import {   
    getMyListings,
    getBookingRequestsForOwner
,acceptBookingRequest
     } from '../controllers/property.controller.js';

     import searchProperties from '../controllers/search.controller.js';

// // Public routes
// router.get('/', PropertyController.getAllProperties);
// router.get('/search', SearchController.advancedSearch);
// router.get('/nearby', SearchController.nearbyProperties);
// router.get('/featured', SearchController.getFeaturedProperties);
// router.get('/trending', SearchController.getTrendingProperties);
// router.get('/:id', PropertyController.getPropertyById);
// router.post('/:id/view', PropertyController.incrementView);

// // Protected routes (require authentication)
// router.use(auth); // Apply auth middleware to all routes below

router.post('/addProperty',   authMiddleware,PropertyController.createProperty);
router.get('/my-listings', authMiddleware, getMyListings);
//see booking requests for owner
router.get('/get-booking-requests', authMiddleware, getBookingRequestsForOwner);

//accept booking request
router.patch('/booking-requests/:bookingRequestId/accept', authMiddleware, acceptBookingRequest);

// router.put('/:id', PropertyController.updateProperty);
// router.delete('/:id', PropertyController.deleteProperty);
// router.post('/:id/bookmark', PropertyController.bookmarkProperty);
// router.delete('/:id/bookmark', PropertyController.removeBookmark);


router.use('/search-properties',searchProperties);
//router.post("/add-property",PropertyController.createProperty);

export default router;