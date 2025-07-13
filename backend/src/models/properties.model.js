import mongoose, { Schema } from "mongoose";
const nearbyPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['hospital', 'mall', 'school', 'market', 'other'], // Extend as needed
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  }
});

const propertiesSchema = new mongoose.Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['available', 'booked', 'unavailable'],
    default: 'available'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  landmark: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  roomType: {
    type: String,
    enum: ['single room', '1 bhk', '2 bhk','3 bhk','4 bhk','1 bk','2 bk','3 bk','4 bk' , 'tiny home'],
    required: true
  },
  photoUrls: {
    type: [String],
    default: []
  },
  facility: {
    parking: { type: Boolean, default: false },
    drinkingWater: { type: Boolean, default: false },
    wifi: { type: Boolean, default: false },
    ac: { type: Boolean, default: false },
    kitchen: { type: Boolean, default: false },
    swimmingPool: { type: Boolean, default: false }
  },
  location: {
    lat: { type: Number, required: true },
    long: { type: Number, required: true }
  },
  description: {
    type: String,
    required: true
  },
  nearbyPlaces: {
    type: [nearbyPlaceSchema],
    default: []
  },
  rating: {
    // type: Number,
    // default: 4.5,
    // min: 0,
    // max: 5

    average: { type: Number, default: 0 },
    totalRatings: { type: Number, default: 0 },
    ratingSum: { type: Number, default: 0 }
  
  }
}, 


{
  timestamps: true
});

// ✅ Add text index for full-text search
propertiesSchema.index(
  {
    title: 'text',
    city: 'text',
    landmark: 'text',
    description: 'text',
    roomType: 'text'
  },
  {
    weights: {
      title: 5,
      city: 3,
      description: 2,
      landmark: 1,
      roomType: 3
    }
  }
);





const Property = mongoose.model('Property', propertiesSchema);
export default Property;