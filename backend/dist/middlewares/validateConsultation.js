"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expressValidator = require("express-validator");

var validateConsultation = [(0, _expressValidator.body)("user_id").isInt().withMessage("User ID harus berupa angka."), (0, _expressValidator.body)("fish_type_id").isInt().withMessage("Fish Type ID harus berupa angka."), (0, _expressValidator.body)("fish_age").isFloat({ min: 0 }).withMessage("Umur ikan harus angka positif."), (0, _expressValidator.body)("fish_length").isFloat({ min: 0 }).withMessage("Panjang ikan harus angka positif."), (0, _expressValidator.body)("consultation_topic").notEmpty().withMessage("Topik konsultasi harus diisi."), (0, _expressValidator.body)("complaint").notEmpty().withMessage("Keluhan harus diisi.")];
exports.validateConsultation = validateConsultation;