var express = require('express');
var router = express.Router();
var multer  =   require('multer');

var publishStorage = multer.diskStorage({
    destination: function(req, file, callback){
        callback(null, './public/pdfs/');
    },
    filename: function(req, file, callback){
    	filename = Date.now() + '.pdf';
        callback(null, filename); 
    }
});
var uploadPublish = multer({storage: publishStorage});

router.post('/upload', uploadPublish.single('publication-file'),  (req, res) => {
    res.json({
        success : true,
        filepath: req.file.path
    });
});

module.exports = router;