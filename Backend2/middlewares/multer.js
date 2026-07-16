const multer = require("multer"); // This will help us load the image sent by the front to the memory

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload