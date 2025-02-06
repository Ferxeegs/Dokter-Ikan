import path from 'path';
import fs from 'fs';
import multer from 'multer';

// Tentukan folder penyimpanan file
const UPLOADS_DIR = 'uploads';

// Pastikan folder tersedia
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Konfigurasi Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

export const upload = multer({ storage });

// Controller untuk upload file
export const uploadFiles = (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'No files uploaded' });
    }

    // Kirim respons dengan daftar file yang diupload
    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);
    res.json({ filePaths });
};

// Controller untuk mendapatkan daftar file
export const getFiles = (req, res) => {
    fs.readdir(UPLOADS_DIR, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to list files' });
        }
        res.json(files.map(file => ({ fileName: file, url: `/uploads/${file}` })));
    });
};

// Controller untuk menghapus file
export const deleteFile = (req, res) => {
    const { fileName } = req.body; // Ambil nama file dari body request
    
    if (!fileName) {
        return res.status(400).json({ message: 'File name is required' });
    }

    const filePath = path.join(UPLOADS_DIR, fileName); // Path lengkap file yang akan dihapus

    // Hapus file dari server lokal
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Gagal menghapus file:', err);
            return res.status(500).json({ message: 'Failed to delete file' });
        }

        res.json({ message: 'File successfully deleted' });
    });
};
