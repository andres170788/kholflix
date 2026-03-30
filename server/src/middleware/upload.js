const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let folder = 'posters';
    if (file.fieldname === 'video') folder = 'videos';
    else if (file.fieldname === 'backdrop') folder = 'backdrops';
    else if (file.fieldname === 'avatar') folder = 'avatars';
    else if (file.fieldname === 'poster') folder = 'posters';

    const dir = path.join(uploadDir, folder);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedImage = /jpeg|jpg|png|webp|gif/;
  const allowedVideo = /mp4|webm|mkv|avi/;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (file.fieldname === 'video') {
    cb(null, allowedVideo.test(ext));
  } else {
    cb(null, allowedImage.test(ext));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 } // 500MB max
});

module.exports = upload;
