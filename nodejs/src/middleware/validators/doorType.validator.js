/**
 * Door Type Validator
 * Validates request data for door type endpoints
 */
const { body, param, validationResult } = require('express-validator');
const { error } = require('@utils/responseHandler');
const { BAD_REQUEST } = require('@utils/responseCodes');

/**
 * Validate door type ID parameter
 */
const validateDoorTypeId = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Door type ID must be a positive integer'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return error(res, errors.array()[0].msg, BAD_REQUEST);
        }
        next();
    }
];

/**
 * Validate door type creation data
 */
const validateCreateDoorType = [
    body('name')
        .notEmpty()
        .withMessage('Door type name is required')
        .isString()
        .withMessage('Door type name must be a string')
        .isLength({ min: 2, max: 50 })
        .withMessage('Door type name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return error(res, errors.array()[0].msg, BAD_REQUEST);
        }
        next();
    }
];

/**
 * Validate door type update data
 */
const validateUpdateDoorType = [
    param('id')
        .isInt({ min: 1 })
        .withMessage('Door type ID must be a positive integer'),
    body('name')
        .optional()
        .isString()
        .withMessage('Door type name must be a string')
        .isLength({ min: 2, max: 50 })
        .withMessage('Door type name must be between 2 and 50 characters'),
    body('description')
        .optional()
        .isString()
        .withMessage('Description must be a string'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return error(res, errors.array()[0].msg, BAD_REQUEST);
        }
        next();
    }
];

module.exports = {
    validateDoorTypeId,
    validateCreateDoorType,
    validateUpdateDoorType
};