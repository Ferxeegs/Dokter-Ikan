"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersConsultationMessageControllerJs = require("../controllers/ConsultationMessageController.js");

var router = _express2["default"].Router();

router.post("/messages/send", _controllersConsultationMessageControllerJs.sendMessage);
router.get("/messages/:consultation_id", _controllersConsultationMessageControllerJs.getMessagesByConsultation);
router.put("/messages/read", _controllersConsultationMessageControllerJs.markMessagesAsRead);

exports["default"] = router;
module.exports = exports["default"];