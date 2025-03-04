'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersPrescriptionMedicineControllerJs = require('../controllers/PrescriptionMedicineController.js');

var router = _express2['default'].Router();

router.get('/prescriptions-medicines', _controllersPrescriptionMedicineControllerJs.getAllPrescriptionMedicines);
router.post('/prescriptions-medicines', _controllersPrescriptionMedicineControllerJs.createPrescriptionMedicine);

exports['default'] = router;
module.exports = exports['default'];