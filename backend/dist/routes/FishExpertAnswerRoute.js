"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _express = require("express");

var _express2 = _interopRequireDefault(_express);

var _controllersFishExpertAnswerControllerJs = require("../controllers/FishExpertAnswerController.js");

var _middlewaresAuthMiddlewareJs = require("../middlewares/authMiddleware.js");

var router = _express2["default"].Router();

router.get("/fish-expert-answers", _controllersFishExpertAnswerControllerJs.getAllFishExpertAnswers);
router.get("/fish-expert-answers/:id", _controllersFishExpertAnswerControllerJs.getFishExpertAnswerById);
router.post("/fish-expert-answers", _middlewaresAuthMiddlewareJs.authenticate, _controllersFishExpertAnswerControllerJs.createFishExpertAnswer);
router.put("/fish-expert-answers/:id", _controllersFishExpertAnswerControllerJs.updateFishExpertAnswer);

exports["default"] = router;
module.exports = exports["default"];