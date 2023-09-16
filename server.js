const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const archiver = require('archiver');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'http://localhost:4200'
}));

mongoose.connect('mongodb://localhost:27017', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Mongo DB connection error'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const uploadedFileSchema = new mongoose.Schema({
  originalName: String,
  storedName: String,
  uniqueIdentifier: String,
});

const UploadedFile = mongoose.model('UploadedFile', uploadedFileSchema);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },

  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split('').join('-');
    cb(null, Date.now() + '-' + fileName);
  }
});

const upload = multer({ storage });

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const uploadedFile = new UploadedFile({
    originalName: req.file.originalname,
    storedName: req.file.filename,
    uniqueIdentifier: generateUniqueIdentifier(),
  });

  await uploadedFile.save();

  res.status(200).json({ message: 'File uploaded successfully' });
});

app.get('/download/:uniqueIdentifier', async (req, res) => {
  const uniqueIdentifier = req.params.uniqueIdentifier;

  const uploadFiles = await UploadedFile.find({ uniqueIdentifier });

  if (uploadFiles.length === 0) {
    return res.status(404).json({ message: 'No files found for this identifier' });
  }

  const archive = archiver('zip', {
    zlib: { level: 9 }, // Compression level (optional)
  });

  archive.pipe(res);

  uploadFiles.forEach((file) => {
    archive.file(`uploads/${file.storedName}`, { name: file.originalName });
  });

  archive.finalize();
});

app.listen(port, () => {
  console.log(`Express server listening on http://localhost:${port}/`);
});

function generateUniqueIdentifier() {
  const timestamp = Date.now();
  return `unique_${timestamp}`;
}
