import Property from '../models/properties.model.js'

import { validationResult } from 'express-validator';
import Wallet from '../models/wallet_model.js'; // Adjust the path to your wallet model

import BookingRequest from '../models/users/booking_request_model.js'; // Adjust the import path as necessary
class PropertyController {
    
  
    // POST /api/properties - Create new listing (owners only) ✨
    static async createProperty(req, res) {
     //   console.log('Raw req.body:', JSON.stringify(req.body, null, 2));
  const userId = req.user.id; //
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: errors.array()
                });
            }

       

            const propertyData = {
                ...req.body,
                
                //ownerId: req.user._id,
               // adId,
                views: { total: 0, unique: 0, daily: [] },
                interestedUsers: [],
                isActive: true,
                isFeatured: false,
                isVerified: false,
                moderationStatus: 'pending',
                rejectionReason: '',

                postedDate: new Date(),
                expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 90 days
                createdAt: new Date(),
                updatedAt: new Date()
            };
             const wallet = await Wallet.findOne({ userId });

  if (!wallet || wallet.points < 10) {
    return res.status(400).json({ message: 'Insufficient points' });
  }
   console.log('Property data:', propertyData);
            const property = new Property(propertyData);
            console.log('New property instance:', property);
            await property.save();
 wallet.points -= 10;
  await wallet.save();
            //await property.populate('ownerId', 'fullName avatar isVerified');

            res.status(201).json({
                success: true,
                message: 'Property listed successfully! Pending admin approval.',
                data: property
            });

        } catch (error) {
            console.error('Create property error:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to create property listing',
                error: error.message
            });
        }
    }


    // Helper function to generate unique AD ID
    static async generateAdId() {
        const year = new Date().getFullYear();
        const count = await Property.countDocuments({}) + 2;
        return `RR${year}${count.toString().padStart(6, '0')}`;
    }
   
    
}


export { PropertyController };

export const getMyListings = async (req, res) => {
  try {
    const userId = req.user.id; // assuming JWT stores { id: user._id }

    const properties = await Property.find({ ownerId: userId });

    res.status(200).json({
      success: true,
      message: 'Fetched your listings',
      data: properties
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch your listings',
      error: err.message
    });
  }
};

//owner views all booking requests for their properties
export const getBookingRequestsForOwner = async (req, res) => {
  console.log('aayo')
  try {
    const ownerId = req.user.id;

    // Find all properties of this owner
    const properties = await Property.find({ ownerId }).select('_id title roomType');

    const propertyIds = properties.map(p => p._id);
console.log('Property IDs:', propertyIds);
    // Find booking requests for these properties
    const requests = await BookingRequest.find({ propertyId: { $in: propertyIds } })
      .populate({
        path: 'propertyId',
        select: 'title roomType',
      })
      .populate({
        path: 'senderId',
        select: 'fullName avatar phone',
      })
      .exec();

    res.status(200).json({
      success: true,
      message: 'Booking requests fetched',
      data: requests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch booking requests', error: error.message });
  }
};

//owner accept booking request
export const acceptBookingRequest = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { bookingRequestId } = req.params;
console.log('Booking Request ID:', bookingRequestId);
    // Find the booking request
    const bookingRequest = await BookingRequest.findById(bookingRequestId);
    if (!bookingRequest) {
      return res.status(404).json({ success: false, message: 'Booking request not found' });
    }
console.log('Booking Request:', bookingRequest.propertyId);
    // Find the property and confirm it belongs to the owner
    const property = await Property.findById(bookingRequest.propertyId);
    if (!property || property.ownerId.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    // Update booking request status
    bookingRequest.status = 'accepted';
    await bookingRequest.save();

    // Update property status to inactive or booked
    property.status = 'unavailable'; // or 'booked' depending on your enum
    await property.save();

    res.status(200).json({
      success: true,
      message: 'Booking request accepted and property status updated',
      data: bookingRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to accept booking request', error: error.message });
  }
};
