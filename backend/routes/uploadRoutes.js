const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();
const uploadController = require('../controllers/uploadController');

// Ensure uploads directory exists before multer tries to write into it
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
	fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, UPLOAD_DIR);
	},
	filename: function (req, file, cb) {
		const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
		cb(null, unique + path.extname(file.originalname));
	}
});

const upload = multer({ storage });

// Routes
// POST /api/uploads/       - upload a single file (field name: 'file')
// GET  /api/uploads/       - list uploaded files
// GET  /api/uploads/:name  - download/serve a file
// DELETE /api/uploads/:name - delete a file

router.post('/', upload.single('file'), uploadController.uploadFile);
router.get('/', uploadController.getFiles);
router.get('/:name', uploadController.getFile);
router.delete('/:name', uploadController.deleteFile);

module.exports = router;
