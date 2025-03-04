'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersFishTypeControllerJs = require('../controllers/FishTypeController.js');

var router = _express2['default'].Router();

// Definisi route untuk jenis ikan
router.get('/fish-types', _controllersFishTypeControllerJs.getAllFishTypes);
router.get('/fish-types/:id', _controllersFishTypeControllerJs.getFishTypeById);
router.get("/fish/search", _controllersFishTypeControllerJs.getFishTypeByName);

exports['default'] = router;
module.exports = exports['default'];