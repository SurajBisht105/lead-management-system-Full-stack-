const { body } = require('express-validator');

exports.validateLead = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),
  
  body('message')
    .optional()
    .trim()
    .isLength({ max: 500 }).withMessage('Message cannot exceed 500 characters'),
  
  body('source')
    .optional()
    .isIn(['Website', 'Social Media', 'Referral', 'Direct', 'Other'])
    .withMessage('Invalid source')
];

exports.validateStatus = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Qualified', 'Lost', 'Converted'])
    .withMessage('Invalid status')
];