"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _this = this;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _modelsConsultationMessageModelJs = require("../models/ConsultationMessageModel.js");

var _modelsConsultationMessageModelJs2 = _interopRequireDefault(_modelsConsultationMessageModelJs);

var _modelsConsultationModelJs = require("../models/ConsultationModel.js");

var _modelsConsultationModelJs2 = _interopRequireDefault(_modelsConsultationModelJs);

require("regenerator-runtime/runtime");

// Kirim pesan dalam konsultasi
var sendMessage = function sendMessage(req, res) {
    var _req$body, consultation_id, sender_role, message, consultation, newMessage;

    return regeneratorRuntime.async(function sendMessage$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                _req$body = req.body;
                consultation_id = _req$body.consultation_id;
                sender_role = _req$body.sender_role;
                message = _req$body.message;

                if (["user", "expert"].includes(sender_role)) {
                    context$1$0.next = 7;
                    break;
                }

                return context$1$0.abrupt("return", res.status(400).json({ message: "Invalid sender role" }));

            case 7:
                context$1$0.next = 9;
                return regeneratorRuntime.awrap(_modelsConsultationModelJs2["default"].findByPk(consultation_id));

            case 9:
                consultation = context$1$0.sent;

                if (consultation) {
                    context$1$0.next = 12;
                    break;
                }

                return context$1$0.abrupt("return", res.status(404).json({ message: "Consultation not found" }));

            case 12:
                context$1$0.next = 14;
                return regeneratorRuntime.awrap(_modelsConsultationMessageModelJs2["default"].create({
                    consultation_id: consultation_id,
                    sender_role: sender_role,
                    message: message
                }));

            case 14:
                newMessage = context$1$0.sent;

                res.status(201).json({
                    message: "Message sent successfully",
                    data: newMessage
                });
                context$1$0.next = 21;
                break;

            case 18:
                context$1$0.prev = 18;
                context$1$0.t0 = context$1$0["catch"](0);

                res.status(500).json({ message: "Error sending message", error: context$1$0.t0.message });

            case 21:
            case "end":
                return context$1$0.stop();
        }
    }, null, _this, [[0, 18]]);
};

exports.sendMessage = sendMessage;
// Ambil semua pesan dalam satu konsultasi (untuk user & expert)
var getMessagesByConsultation = function getMessagesByConsultation(req, res) {
    var consultation_id, messages;
    return regeneratorRuntime.async(function getMessagesByConsultation$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                consultation_id = req.params.consultation_id;
                context$1$0.next = 4;
                return regeneratorRuntime.awrap(_modelsConsultationMessageModelJs2["default"].findAll({
                    where: { consultation_id: consultation_id },
                    order: [["created_at", "ASC"]] // Urutkan berdasarkan waktu
                }));

            case 4:
                messages = context$1$0.sent;

                res.status(200).json({ messages: messages });
                context$1$0.next = 11;
                break;

            case 8:
                context$1$0.prev = 8;
                context$1$0.t0 = context$1$0["catch"](0);

                res.status(500).json({ message: "Error retrieving messages", error: context$1$0.t0.message });

            case 11:
            case "end":
                return context$1$0.stop();
        }
    }, null, _this, [[0, 8]]);
};

exports.getMessagesByConsultation = getMessagesByConsultation;
// Tandai pesan sebagai telah dibaca
var markMessagesAsRead = function markMessagesAsRead(req, res) {
    var consultation_id;
    return regeneratorRuntime.async(function markMessagesAsRead$(context$1$0) {
        while (1) switch (context$1$0.prev = context$1$0.next) {
            case 0:
                context$1$0.prev = 0;
                consultation_id = req.body.consultation_id;
                context$1$0.next = 4;
                return regeneratorRuntime.awrap(_modelsConsultationMessageModelJs2["default"].update({ is_read: true }, { where: { consultation_id: consultation_id } }));

            case 4:

                res.status(200).json({ message: "Messages marked as read" });
                context$1$0.next = 10;
                break;

            case 7:
                context$1$0.prev = 7;
                context$1$0.t0 = context$1$0["catch"](0);

                res.status(500).json({ message: "Error updating messages", error: context$1$0.t0.message });

            case 10:
            case "end":
                return context$1$0.stop();
        }
    }, null, _this, [[0, 7]]);
};
exports.markMessagesAsRead = markMessagesAsRead;

// Pastikan sender_role valid

// Periksa apakah konsultasi ada

// Simpan pesan ke database