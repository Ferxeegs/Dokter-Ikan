'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersPrescriptionControllerJs = require('../controllers/PrescriptionController.js');

var router = _express2['default'].Router();

// Definisi route untuk resep medis
router.get('/prescriptions', _controllersPrescriptionControllerJs.getAllPrescriptions);
router.get('/prescriptionsbyconsultation', _controllersPrescriptionControllerJs.getPrescriptionsByConsultationId);
router.post('/prescriptions', _controllersPrescriptionControllerJs.createPrescription);

exports['default'] = router;
module.exports = exports['default'];