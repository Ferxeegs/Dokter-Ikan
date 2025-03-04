'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _controllersUploadControllerJs = require('../controllers/UploadController.js');

var _controllersUploadFIshControllerJs = require('../controllers/UploadFIshController.js');

var router = _express2['default'].Router();

router.post('/upload', _controllersUploadControllerJs.upload.array('files'), _controllersUploadControllerJs.uploadFiles);
router.post('/upload-fish', _controllersUploadFIshControllerJs.uploadFishImage);
router.get('/uploads', _controllersUploadControllerJs.getFiles);
router['delete']('/delete-file', _controllersUploadControllerJs.deleteFile);

exports['default'] = router;
module.exports = exports['default'];