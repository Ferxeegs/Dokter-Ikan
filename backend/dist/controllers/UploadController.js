'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _dotenv = require("dotenv");

var _dotenv2 = _interopRequireDefault(_dotenv);

require("regenerator-runtime/runtime");

_dotenv2['default'].config();

var MODEL_API_URL = process.env.MODEL_API_URL;

// Tentukan folder penyimpanan file
var UPLOADS_DIR = 'uploads';

// Pastikan folder tersedia
if (!_fs2['default'].existsSync(UPLOADS_DIR)) {
    _fs2['default'].mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Konfigurasi Multer
var storage = _multer2['default'].diskStorage({
    destination: function destination(req, file, cb) {
        cb(null, UPLOADS_DIR);
    },
    filename: function filename(req, file, cb) {
        var uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + _path2['default'].extname(file.originalname));
    }
});

var upload = (0, _multer2['default'])({ storage: storage });

exports.upload = upload;
// Controller untuk upload file
var uploadFiles = function uploadFiles(req, res) {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // Kirim respons dengan daftar file yang diupload
    var filePaths = req.files.map(function (file) {
        return '/uploads/' + file.filename;
    });
    res.json({ filePaths: filePaths });
};

exports.uploadFiles = uploadFiles;
// Controller untuk mendapatkan daftar file
var getFiles = function getFiles(req, res) {
    _fs2['default'].readdir(UPLOADS_DIR, function (err, files) {
        if (err) {
            return res.status(500).json({ message: 'Failed to list files' });
        }
        res.json(files.map(function (file) {
            return { fileName: file, url: '/uploads/' + file };
        }));
    });
};

exports.getFiles = getFiles;
// Controller untuk menghapus file
var deleteFile = function deleteFile(req, res) {
    var fileName = req.body.fileName;
    // Ambil nama file dari body request

    if (!fileName) {
        return res.status(400).json({ message: 'File name is required' });
    }

    var filePath = _path2['default'].join(UPLOADS_DIR, fileName); // Path lengkap file yang akan dihapus

    // Hapus file dari server lokal
    _fs2['default'].unlink(filePath, function (err) {
        if (err) {
            console.error('Gagal menghapus file:', err);
            return res.status(500).json({ message: 'Failed to delete file' });
        }

        res.json({ message: 'File successfully deleted' });
    });
};
exports.deleteFile = deleteFile;