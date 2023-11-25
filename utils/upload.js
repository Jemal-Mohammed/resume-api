// const multer = require('multer');
import multer from 'multer';
// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // console.log(file);
    cb(null, 'uploads/'); // Specify the destination folder for uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Set the file name to be unique
  },
});

// Initialize multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // Limit file size to 5MB (adjust as needed)
  },
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// Check File Type
function checkFileType(file, cb) {
  // Allowed extensions
  const filetypes = /jpeg|jpg|png/;
  // Check the extension
  const extname = filetypes.test(String(file.originalname).toLowerCase());
  // Check the MIME type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images only! (jpeg, jpg, png)');
  }
}

export default  upload;
