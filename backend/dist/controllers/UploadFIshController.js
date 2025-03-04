"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _this2 = this;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _multer = require("multer");

var _multer2 = _interopRequireDefault(_multer);

var _formData = require("form-data");

var _formData2 = _interopRequireDefault(_formData);

// Import form-data

require("regenerator-runtime/runtime");

// Konfigurasi Multer untuk menyimpan file di folder 'uploads'
var storage = _multer2["default"].diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads'); // Tentukan folder upload
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + file.originalname); // Menyimpan file dengan timestamp
  }
});

var upload = (0, _multer2["default"])({ storage: storage }).single('file'); // 'file' adalah nama field di form data
var MODEL_API_URL = process.env.MODEL_API_URL; // URL model AI

// Fungsi upload
var uploadFishImage = function uploadFishImage(req, res) {
  return regeneratorRuntime.async(function uploadFishImage$(context$1$0) {
    var _this = this;

    while (1) switch (context$1$0.prev = context$1$0.next) {
      case 0:
        console.log("Start uploadFishImage function"); // Log untuk debugging

        // Pastikan file diterima di request body
        upload(req, res, function callee$1$0(err) {
          var imagePath, formData, response;
          return regeneratorRuntime.async(function callee$1$0$(context$2$0) {
            while (1) switch (context$2$0.prev = context$2$0.next) {
              case 0:
                if (!err) {
                  context$2$0.next = 3;
                  break;
                }

                console.error("Upload error:", err.message); // Log error upload
                return context$2$0.abrupt("return", res.status(400).json({ success: false, message: "Error uploading file" }));

              case 3:
                if (req.file) {
                  context$2$0.next = 6;
                  break;
                }

                console.error("No file uploaded"); // Log jika file tidak ditemukan
                return context$2$0.abrupt("return", res.status(400).json({ success: false, message: "No file uploaded" }));

              case 6:

                console.log("File uploaded successfully:", req.file.path); // Log jika file berhasil diupload

                context$2$0.prev = 7;
                imagePath = req.file.path;
                formData = new _formData2["default"]();

                formData.append('image', _fs2["default"].createReadStream(imagePath)); // Menambahkan file gambar ke form-data

                console.log("Sending image to AI model"); // Log untuk proses pengiriman gambar ke AI

                // Menggunakan axios untuk mengirim form-data ke backend model
                context$2$0.next = 14;
                return regeneratorRuntime.awrap(_axios2["default"].post(MODEL_API_URL, formData, {
                  headers: _extends({}, formData.getHeaders())
                }));

              case 14:
                response = context$2$0.sent;
                // Menambahkan header dari form-data secara otomatis

                console.log("Received response from AI model:", response.data); // Log hasil dari AI model

                // Hapus file setelah dikirim ke AI
                _fs2["default"].unlinkSync(imagePath);

                // Pastikan response dari AI memiliki struktur yang jelas
                // Response yang diterima sudah berupa array, bukan objek dengan 'predictions'

                if (!(!response.data || response.data.length === 0)) {
                  context$2$0.next = 20;
                  break;
                }

                console.error("AI model did not return valid predictions"); // Log jika tidak ada prediksi
                return context$2$0.abrupt("return", res.status(500).json({ success: false, message: "AI model did not return predictions" }));

              case 20:
                return context$2$0.abrupt("return", res.json({
                  success: true,
                  message: "Image processed successfully",
                  predictions: response.data }));

              case 23:
                context$2$0.prev = 23;
                context$2$0.t0 = context$2$0["catch"](7);

                console.error("Error:", context$2$0.t0.message); // Log error jika ada masalah saat pengiriman
                return context$2$0.abrupt("return", res.status(500).json({
                  success: false,
                  message: "Internal server error",
                  error: context$2$0.t0.message
                }));

              case 27:
              case "end":
                return context$2$0.stop();
            }
          }, null, _this, [[7, 23]]);
        });

      case 2:
      case "end":
        return context$1$0.stop();
    }
  }, null, _this2);
};
exports.uploadFishImage = uploadFishImage;

// Baca file gambar yang diupload

// Kirim gambar ke backend model AI dalam form-data
// Menyertakan langsung array hasil prediksi