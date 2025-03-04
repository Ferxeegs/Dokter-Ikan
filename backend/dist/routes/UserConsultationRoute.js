'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersUserConsultationControllerJs = require('../controllers/UserConsultationController.js');

var _middlewaresAuthMiddlewareJs = require('../middlewares/authMiddleware.js');

var _middlewaresValidateConsultationJs = require('../middlewares/validateConsultation.js');

var router = _express2['default'].Router();

router.get('/user-consultations', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserConsultationControllerJs.getAllUserConsultations);
router.get('/user-consultations/:id', _controllersUserConsultationControllerJs.getUserConsultationById);
router.post('/user-consultations', _middlewaresAuthMiddlewareJs.authenticate, _middlewaresValidateConsultationJs.validateConsultation, _controllersUserConsultationControllerJs.createUserConsultation);
router.get('/user-consultation', _middlewaresAuthMiddlewareJs.authenticate, _controllersUserConsultationControllerJs.getUserConsultationHistory);

exports['default'] = router;
module.exports = exports['default'];