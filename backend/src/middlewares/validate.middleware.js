import { body } from 'express-validator';

const validateProperty = [
    body('title').trim().isLength({ min: 5, max: 100 }),
    body('purpose').isIn(['residential_property', 'commercial_property', 'property_on_sale']),
    body('type').isIn(['single_room', 'two_rooms', '1bhk', '2bhk', '3bhk', 'flat', 'house']),
    body('price.amount').isNumeric().isInt({ min: 1 }),
    body('location.address.city').trim().isLength({ min: 2 }),
    // ... more validations
];
export default validateProperty;