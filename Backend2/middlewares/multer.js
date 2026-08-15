const multer = require("multer"); // This will help us load the image sent by the front to the memory

const upload = multer({ 
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 
    }
 });

 module.exports = upload;