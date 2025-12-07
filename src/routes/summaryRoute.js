const express = require('express')
const multer = require('multer');
const path = require('path');

const router = express.Router();


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        // cb(null, 'uploads/')
        cb(null, path.join(__dirname, 'uploads2'));
    },
    filename: function(req, file, cb){
        cb(null, file.originalname);
    },
});

const upload = multer({storage : storage});

const summaryControllerFile = require('../controllers/summaryController');

router.post('/generateaidocsummary', upload.single('file'), summaryControllerFile.generateAIDocSummary);
router.post('/firstopenaiapi', summaryControllerFile.firstOpenAIApi);

module.exports = router;