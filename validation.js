const {check, validationResult} = require('express-validator');

module.exports.userSchema = [
    check('email', 'Email cant be empty')
        .notEmpty()
        .isEmail().withMessage('Email is not valid')
        .isLength({ min: 5 }).withMessage('Email must be at least 5 character'),
    check('password', 'Password cant be empty')
        .notEmpty()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 character'),
    check('firstName', 'First name cant be empty')
        .notEmpty()
        .isLength({ min: 2 }).withMessage('First name must be at least 2 character'),
    check('lastName', 'Last name cant be empty')
        .notEmpty()
        .isLength({ min: 2 }).withMessage('Last name must be at least 6 character'),
];
module.exports.loginSchema = [
    check('email', 'Email cant be empty')
        .notEmpty()
        .isEmail().withMessage('Email is not valid')
        .isLength({ min: 5 }).withMessage('Email must be at least 5 character'),
    check('password', 'Password cant be empty')
        .notEmpty()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 character')
];
module.exports.validation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};




