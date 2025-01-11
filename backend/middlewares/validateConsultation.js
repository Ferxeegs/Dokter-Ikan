import { body } from "express-validator";

export const validateConsultation = [
  body("user_id").isInt().withMessage("User ID harus berupa angka."),
  body("fish_type_id").isInt().withMessage("Fish Type ID harus berupa angka."),
  body("fish_age").isFloat({ min: 0 }).withMessage("Umur ikan harus angka positif."),
  body("fish_length").isFloat({ min: 0 }).withMessage("Panjang ikan harus angka positif."),
  body("consultation_topic").notEmpty().withMessage("Topik konsultasi harus diisi."),
  body("complaint").notEmpty().withMessage("Keluhan harus diisi."),
];
