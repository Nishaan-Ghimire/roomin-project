import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/users/user_model.js';

import Property from '../models/properties.model.js'; // Adjust the path to your property model
import BookingRequest from '../models/users/booking_request_model.js';
import Wallet from '../models/wallet_model.js'; // Adjust the path to your wallet model
// import { UserAnalytics, ActivityLog } from '../models/analytics.model.js';
import { AnalyticsService } from '../functions/analytics.service.js';



//REGISTER USER
async function registerUser(req, res) {
  try {
    const { name, email, password, phone, profilePhoto, role } = req.body;

    // Validate required fields
    if (!name || !email || !password || !role)
      return res.status(400).json({ message: "Please provide all required fields" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      profilePhoto,
      role,
    });
    const userId = user._id; 
    await user.save();
// After user creation(small points as a reward of signup)
    if (role=='vendor') {
    await Wallet.create({ userId: userId, points: 30 });

}
//await Wallet.create({ userId: userId, points: 30 });
    res.status(201).json({ message: "User registered successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};









// LOGIN USER
async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: 'User not found' });
      
    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: 'Invalid credentials' });

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });
    await AnalyticsService.trackLogin(user._id, req);
    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};














// GET USER PROFILE
async function getProfile(req, res) {
  try {
    const userId = req.user.id; // This assumes you're using auth middleware
    const user = await User.findById(userId).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Profile fetch failed', error: err.message });
  }
};







// UPDATE USER PROFILE
async function updateProfile(req, res) {
  try {
    const userId = req.user.id;
    const update = req.body;

    // If password is being updated, hash it
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(userId, update, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.status(200).json({ message: 'Profile updated', user: updatedUser });
  } catch (err) {
    res.status(500).json({ message: 'Profile update failed', error: err.message });
  }
};









// GET ALL PROPERTIES
async function getAllProperties(req, res) {
  try {
    const properties = await Property.find(); // Fetch all properties
    res.status(200).json({ properties });
  } catch (error) {
    res.status(500).json({ message: 'Failed to get properties', error: error.message });
  }
};



//SEND BOOKING REQUEST
async function sendBookingRequest(req, res) {
  try {
    const userId = req.user.id; // from auth middleware
    const { propertyId } = req.body;

     const wallet = await Wallet.findOne({ userId });

  if (!wallet || wallet.points < 10) {
    return res.status(400).json({ message: 'Insufficient points' });
  }
    // Optionally check if property exists and is available
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }
    if (property.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Property not available' });
    }






    //CHECK IF REQUEST ALREADY SENT
    const existingRequest = await BookingRequest.findOne({ propertyId, senderId: userId });
    if (existingRequest) {
      return res.status(400).json({ success: false, message: 'You already sent a booking request' });
    }

    const bookingRequest = new BookingRequest({
      propertyId,
      senderId: userId,
    });

    await bookingRequest.save();
// Deduct points
  wallet.points -= 10;
  await wallet.save();
    res.status(201).json({
      success: true,
      message: 'Booking request sent successfully',
      data: bookingRequest,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to send booking request', error: error.message });
  }
};


// export const sendBookingRequest = async (req, res) => {
//   try {
//     const userId = req.user.id; // from auth middleware
//     const { propertyId } = req.body;

//     // Optionally check if property exists and is available
//     const property = await Property.findById(propertyId);
//     if (!property) {
//       return res.status(404).json({ success: false, message: 'Property not found' });
//     }
//     if (property.status !== 'available') {
//       return res.status(400).json({ success: false, message: 'Property not available' });
//     }

//     // Check if request already sent
//     const existingRequest = await BookingRequest.findOne({ propertyId, senderId: userId });
//     if (existingRequest) {
//       return res.status(400).json({ success: false, message: 'You already sent a booking request' });
//     }

//     const bookingRequest = new BookingRequest({
//       propertyId,
//       senderId: userId,
//     });

//     await bookingRequest.save();

//     res.status(201).json({
//       success: true,
//       message: 'Booking request sent successfully',
//       data: bookingRequest,
//     });
//   } catch (error) {
//     res.status(500).json({ success: false, message: 'Failed to send booking request', error: error.message });
//   }
// };









//CHECK BOOKING STATUS
async function checkBookingStatus(req, res) {
  try {
    const userId = req.user.id; // from auth middleware
    const { propertyId } =  req.query;
    console.log(req.query)
    if (!propertyId) {
      return res.status(400).json({ message: "Property ID is required" });
    }

    const request = await BookingRequest.findOne({ propertyId, senderId: userId });

    if (request) {
      return res.status(200).json({ status: 'pending', alreadyRequested: true });
    } else {
      return res.status(200).json({ status: 'not_requested', alreadyRequested: false });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Failed to check booking status',
      error: error.message,
    });
  }
};






//CHANGE PASSWORD
async function changePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Both current and new passwords are required',
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: err.message,
    });
  }
};

// POST /api/wallet/topup
async function topUpWallet(req, res) {
  try {
    const userId = req.user.id;
    const { amount } = req.body; // e.g., 100 rupees

    // Convert to points (Rs. 100 => 50 points)
    const pointsToAdd = amount / 2;

    const wallet = await Wallet.findOneAndUpdate(
      { userId },
      {
        $inc: { points: pointsToAdd },
        $push: {
          transactionHistory: {
            type: 'add',
            amount: pointsToAdd,
            description: `Top-up via Khalti`,
          }
        }
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      message: 'Wallet topped up successfully',
      wallet,
    });

  } catch (err) {
    res.status(500).json({ message: 'Failed to top-up wallet', error: err.message });
  }
};


// Controller method to check wallet points
async function getWalletBalance(req, res) {
  try {
    const userId = req.user.id; // from auth middleware

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found' });
    }

    res.status(200).json({
      success: true,
      points: wallet.points,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch wallet balance', error: error.message });
  }
};






//SEARCH PROPERTIES
async function searchProperties(req, res) {
  console.log(req.query.q);
  try {
    const query = req.query.q;

    if (!query || query.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const results = await Property.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    res.status(200).json({
      success: true,
      message: 'Search results',
      data: results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to perform search',
      error: error.message
    });
  }
};






//GET USER BY ID
async function getUserById(req, res) {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select('-password');

    //const user = await User.findById(userId).select('fullName avatar phone email');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user', error: error.message });
  }
};



//GET MY PROFILE
async function getMyProfile (req, res) {

  const user = await User.findById(req.user.id).select('-password');
  res.json(user);
}




//GET ACCEPTED BOOKINGS
async function getAcceptedBookings(req, res) { 
  try {
    const userId = req.user.id;

    const bookings = await BookingRequest.find({
      senderId: userId,
      status: 'accepted',
    }).populate('propertyId'); // optional: to get property details

    res.json({ success: true, data: bookings });
  } catch (err) {
    console.error('Error fetching accepted bookings:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};





//RATE PROPERTY
async function rateProperty(req, res) {
  const userId = req.user.id;
  const { propertyId } = req.params;
  const { rating } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }
console.log('Rating property:', propertyId, 'by user:', userId, 'with rating:', rating);
  try {
    // Optional: Check if user had an accepted booking
    const hasBooked = await BookingRequest.findOne({
      senderId: userId,
      propertyId,
      status: 'accepted'
    });

    if (!hasBooked) {
      return res.status(403).json({ message: 'You can only rate properties you have booked' });
    }

    const property = await Property.findById(propertyId);
    if (!property) return res.status(404).json({ message: 'Property not found' });

    // Update rating fields
    // ✅ Use the nested rating object
    property.rating.totalRatings += 1;
    property.rating.ratingSum += rating;
    property.rating.average = property.rating.ratingSum / property.rating.totalRatings;


    await property.save();

    res.json({ success: true, message: 'Property rated successfully', averageRating: property.averageRating });
  } catch (err) {
    console.error('Rating error:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};



async function getPropertiesByIds(req, res) {
  const { ids } = req.body;
  
  if (!ids && !Array.isArray(ids)) {
    return res.status(400).json({ message: 'Invalid or missing property IDs.' });
  }

  try {
    const properties = await Property.find({ _id: { $in: ids } });
    return res.json({ success: true, properties });
  } catch (err) {
    return res.status(500).json({ message: 'Error fetching properties', error: err });
  }
}



//
//passkey: oswb onyn gheg tnvu
//sewa mitra  
//const nodemailer = require('nodemailer');

// Generate a 6-digit OTP



export {
  registerUser,
  loginUser,
  getMyProfile,
  updateProfile,
  getAllProperties,
  sendBookingRequest,
  checkBookingStatus,
  changePassword,
  topUpWallet,
  getWalletBalance,
  searchProperties,
  getUserById,
  getAcceptedBookings,
  rateProperty,
  getPropertiesByIds
};


