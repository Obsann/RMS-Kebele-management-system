const fs = require('fs');
const path = require('path');

const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Upload handler (multer will attach `req.file`)
const uploadFile = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Bad Request', message: 'No file uploaded' });

    const fileInfo = {
      originalName: req.file.originalname,
      filename: req.file.filename,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: req.file.path
    };

    res.status(201).json({ message: 'File uploaded', file: fileInfo });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// List uploaded files
const getFiles = async (req, res) => {
  try {
    const files = await fs.promises.readdir(UPLOAD_DIR);
    res.json({ files });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Serve a single file by filename
const getFile = async (req, res) => {
  try {
    const { name } = req.params;
    const filePath = path.join(UPLOAD_DIR, name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not Found', message: 'File does not exist' });
    }

    res.sendFile(filePath);
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

// Delete a file by filename
const deleteFile = async (req, res) => {
  try {
    const { name } = req.params;
    const filePath = path.join(UPLOAD_DIR, name);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Not Found', message: 'File does not exist' });
    }

    await fs.promises.unlink(filePath);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
};

module.exports = { uploadFile, getFiles, getFile, deleteFile };
